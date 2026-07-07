import Groq from 'groq-sdk';
import Product from '../models/Product.model.js';

const FILTER_SYSTEM_PROMPT = `You are an AI Perfume Recommendation Assistant for Inerrancy Premium Perfumes.

Your job is to understand the user's perfume requirements from natural language and convert them into structured filters.

IMPORTANT — use ONLY these exact enum values:
- occasion: "Party & Evening" | "Date Night" | "Daily Wear" | "Summer Fresh" | "Winter Warmth" | "Gym & Active" | "Office Wear" | null
- category (gender): "Men" | "Women" | "Unisex" | null
- fragranceFamily: "Sweet" | "Fresh" | "Woody" | "Spicy" | "Floral" | "Fruity" | "Citrus" | "Oriental" | "Aqua" | null

For budget/price: extract numeric value only (e.g. "below 1500" → maxPrice: 1500, "between 500 and 1000" → minPrice: 500, maxPrice: 1000).

Rules:
1. Analyse the user message carefully.
2. Extract as many filters as possible.
3. Do NOT guess — set missing fields to null.
4. Return ONLY valid JSON, no other text, no markdown code blocks.
5. Map user intent to the exact enum values above.`;

const buildFilterPrompt = (message) => `User message: "${message}"

Return JSON (use null for unknown fields):
{
  "occasion": null,
  "category": null,
  "maxPrice": null,
  "minPrice": null,
  "longevity": null,
  "season": null,
  "timeOfUse": null,
  "fragranceFamily": null,
  "projection": null,
  "premium": null,
  "notes": [],
  "searchKeywords": []
}`;

const RANK_SYSTEM_PROMPT = `You are a luxury perfume recommendation expert for Inerrancy Premium Perfumes.
Given user requirements and available products, rank and recommend the best matches from the provided list ONLY.
CRITICAL: Only recommend products from the provided list. Do not invent products.
Prioritise: budget fit, occasion, fragrance family, longevity preference.
Return ONLY valid JSON — no markdown, no code blocks, no text outside the JSON object.`;

const buildRankPrompt = (filters, products) => `User requirements:
${JSON.stringify(filters, null, 2)}

Available Products (recommend ONLY from this list):
${JSON.stringify(products.map(p => ({
  id: p._id.toString(),
  name: p.name,
  brand: p.brand,
  price: p.price,
  discountPrice: p.discountPrice || null,
  effectivePrice: p.discountPrice || p.price,
  category: p.category,
  fragranceFamily: p.fragranceFamily || null,
  occasion: p.occasion || null,
  notes: p.notes,
  shortDescription: p.shortDescription,
  ratings: p.ratings,
  collection: p.collection || null,
})), null, 2)}

Rank by relevance and return top 6. Use the exact "id" values from above as productId.

Return JSON:
{
  "recommendations": [
    {
      "productId": "exact id from above",
      "name": "product name",
      "price": 0,
      "matchScore": 95,
      "reason": "2-3 sentences explaining exactly why this matches the user requirements"
    }
  ]
}`;

const parseJSON = (text) => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned);
};

// Regex fallback to extract price from user message when LLM misses it
const extractPriceFromMessage = (message) => {
  const patterns = [
    /(?:under|below|max(?:imum)?|budget(?:\s+of)?|up\s*to|less\s*than|within|upto)\s*[₹rs\.]*\s*(\d[\d,]*)/i,
    /[₹rs\.]*\s*(\d[\d,]*)\s*(?:budget|max|only|or\s+less|ke\s+andar|se\s+kam)/i,
    /(\d[\d,]*)\s*(?:rupees?|rs\.?|₹)\s*(?:budget|max|under|below)/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return null;
};

export const getAIRecommendations = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(503).json({ success: false, message: 'AI service is not configured. Please add GROQ_API_KEY to server .env.' });
    }

    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Please describe what you are looking for.' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Step 1 — Extract structured filters
    const filterRes = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 512,
      messages: [
        { role: 'system', content: FILTER_SYSTEM_PROMPT },
        { role: 'user', content: buildFilterPrompt(message) },
      ],
    });

    let filters = {};
    try {
      filters = parseJSON(filterRes.choices[0].message.content);
    } catch {
      filters = {};
    }

    // Regex fallback — ensure budget is always captured even if LLM missed it
    if (!filters.maxPrice) {
      const regexPrice = extractPriceFromMessage(message);
      if (regexPrice) filters.maxPrice = regexPrice;
    }

    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;

    // Step 2 — Query MongoDB with extracted filters
    // Use $or on price + discountPrice so discounted products within budget are included
    const query = { isActive: true };
    if (filters.category) query.category = filters.category;
    if (filters.fragranceFamily) query.fragranceFamily = filters.fragranceFamily;
    if (filters.occasion) query.occasion = filters.occasion;
    if (filters.premium) query.collection = { $in: ['Luxury', 'Collectors Edition'] };
    if (filters.searchKeywords?.length) {
      query.$text = { $search: filters.searchKeywords.join(' ') };
    }

    if (maxPrice || minPrice) {
      const priceOr = [];
      if (maxPrice) priceOr.push({ discountPrice: { $lte: maxPrice } });
      if (maxPrice) priceOr.push({ discountPrice: null, price: { $lte: maxPrice } });
      if (maxPrice) priceOr.push({ discountPrice: { $exists: false }, price: { $lte: maxPrice } });
      if (minPrice) {
        // For minPrice just use the base price field
        query.price = { $gte: minPrice };
      }
      if (priceOr.length) query.$or = priceOr;
    }

    let products = await Product.find(query).sort('-ratings').limit(20);

    // Relax non-price constraints if too few results — budget is ALWAYS kept
    if (products.length < 4) {
      const relaxed = { isActive: true };
      if (maxPrice) {
        relaxed.$or = [
          { discountPrice: { $lte: maxPrice } },
          { discountPrice: null, price: { $lte: maxPrice } },
          { discountPrice: { $exists: false }, price: { $lte: maxPrice } },
        ];
      }
      if (filters.category) relaxed.category = filters.category;
      const extra = await Product.find(relaxed).sort('-ratings').limit(20);
      const seen = new Set(products.map(p => p._id.toString()));
      for (const p of extra) {
        if (!seen.has(p._id.toString())) {
          products.push(p);
          seen.add(p._id.toString());
        }
      }
    }

    // Last resort — still respect budget if given
    if (!products.length) {
      const fallback = { isActive: true };
      if (maxPrice) {
        fallback.$or = [
          { discountPrice: { $lte: maxPrice } },
          { discountPrice: null, price: { $lte: maxPrice } },
          { discountPrice: { $exists: false }, price: { $lte: maxPrice } },
        ];
      }
      products = await Product.find(fallback).sort('-ratings').limit(10);
    }

    if (!products.length) {
      return res.json({ success: true, filters, recommendations: [], message: 'No products found matching your budget. Try increasing your budget.' });
    }

    // Step 3 — Rank products via Groq
    const rankRes = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1500,
      messages: [
        { role: 'system', content: RANK_SYSTEM_PROMPT },
        { role: 'user', content: buildRankPrompt(filters, products) },
      ],
    });

    let recommendations = [];
    try {
      const parsed = parseJSON(rankRes.choices[0].message.content);
      recommendations = parsed.recommendations || [];
    } catch {
      recommendations = products.slice(0, 5).map(p => ({
        productId: p._id.toString(),
        name: p.name,
        price: p.price,
        matchScore: 70,
        reason: `${p.brand} — ${p.fragranceFamily || 'signature'} fragrance${p.occasion ? ` perfect for ${p.occasion}` : ''}.`,
      }));
    }

    // Enrich with full product data
    const productMap = {};
    products.forEach(p => { productMap[p._id.toString()] = p; });

    let enriched = recommendations.slice(0, 6).map(rec => {
      const product = productMap[rec.productId];
      if (!product) return null;
      return {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        discountPrice: product.discountPrice || null,
        images: product.images,
        category: product.category,
        fragranceFamily: product.fragranceFamily || null,
        occasion: product.occasion || null,
        ratings: product.ratings,
        numReviews: product.numReviews,
        matchScore: rec.matchScore,
        reason: rec.reason,
      };
    }).filter(Boolean);

    // Hard post-filter — strictly remove anything over budget (safety net)
    if (maxPrice) {
      enriched = enriched.filter(r => (r.discountPrice || r.price) <= maxPrice);
    }
    if (minPrice) {
      enriched = enriched.filter(r => (r.discountPrice || r.price) >= minPrice);
    }

    res.json({ success: true, filters, recommendations: enriched });
  } catch (err) {
    console.error('[AI Recommend] Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'AI recommendation service is temporarily unavailable.' });
  }
};

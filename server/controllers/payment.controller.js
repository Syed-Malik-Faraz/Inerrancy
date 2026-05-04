import crypto from 'crypto';

// POST /api/payment/create - create dummy payment session
export const createPayment = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    // Generate a dummy transaction session ID
    const sessionId = 'PAY_' + crypto.randomBytes(8).toString('hex').toUpperCase();
    res.json({
      success: true,
      sessionId,
      amount,
      paymentMethod,
      message: 'Dummy payment session created',
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/payment/verify - verify dummy payment
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, paymentMethod } = req.body;
    // Dummy: always returns success with a transaction ID
    const transactionId = 'TXN_' + crypto.randomBytes(10).toString('hex').toUpperCase();
    res.json({
      success: true,
      transactionId,
      sessionId,
      message: 'Payment verified successfully (demo)',
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

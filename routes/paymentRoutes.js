const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// --- CRITICAL CHECKPOINT 1: Razorpay Initialization ---
// Using provided test keys
let razorpay = null;
const RAZORPAY_KEY_ID = 'rzp_test_RfalM2W39n2rA4';
const RAZORPAY_KEY_SECRET = 'S57SFwf0dCVt0repdVl1SPJq';
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay Initialized successfully.');
} else {
  // Add a clear server-side log if keys are missing
  console.error('CRITICAL ERROR: Razorpay environment keys are NOT set.');
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    // --- CRITICAL CHECKPOINT 2: Check for successful initialization ---
    // If keys were missing at startup, 'razorpay' will be null, and this will catch it.
    if (!razorpay) {
        console.error('Razorpay instance is null. Cannot create order.');
        return res.status(500).json({
            success: false,
            message: 'Payment service unavailable (Missing API Keys)'
        });
    }

    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum amount should be ₹1'
      });
    }

    const options = {
      amount: amount, // Amount in paise (₹500 = 50000 paise)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      // Sending the key ID back to the frontend for the Razorpay Checkout widget
      key: RAZORPAY_KEY_ID
    });

  } catch (error) {
    // This catches errors from the Razorpay API itself (e.g., invalid currency, amount too large)
    console.error('Error creating Razorpay order:', error.message || error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order due to service error'
    });
  }
});

// Verify Razorpay payment signature
router.post('/verify-payment', (req, res) => {
  try {
    if (!razorpay) {
        return res.status(500).json({
            success: false,
            message: 'Payment service unavailable (Missing API Keys)'
        });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create expected signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error'
    });
  }
});

module.exports = router;
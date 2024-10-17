


const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');




const PAYPAL_API = process.env.BASE // For sandbox, for production use 'https://api-m.paypal.com'
const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET

// Helper function to get PayPal access token
async function getPayPalToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString('base64');
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get PayPal token');
  }
}

// Create a subscription plan
// app.post('/create-subscription', async (req, res) => {
//   console.log('start create sunscription')

//   try {
//     const token = await getPayPalToken();

//     const planData = {
//       product_id: 'PROD-8AW14054J2863253L', // Create a PayPal product and use its ID
//       name: 'Monthly Subscription',
//       description: 'Monthly subscription for file conversion service',
//       billing_cycles: [{
//         frequency: {
//           interval_unit: 'MONTH',
//           interval_count: 1,
//         },
//         tenure_type: 'REGULAR',
//         sequence: 1,
//         total_cycles: 0, // Infinite cycles
//         pricing_scheme: {
//           fixed_price: {
//             value: '10',
//             currency_code: 'USD',
//           },
//         },
//       }],
//       payment_preferences: {
//         auto_bill_outstanding: true,
//         setup_fee_failure_action: 'CONTINUE',
//         payment_failure_threshold: 3,
//       },
//     };

//     const subscriptionResponse = await axios.post(
//       `${PAYPAL_API}/v1/billing/plans`,
//       planData,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     res.json({ subscriptionId: subscriptionResponse.data.id });
// const xlo  =  subscriptionResponse.data.id
//     console.log('data' , xlo  )
   
//   } catch (error) {
//     console.error('Error creating subscription:', error.response ? error.response.data : error.message);
//     res.status(500).json({ message: 'Failed to create subscription' });
//   }
// });

// Cancel a subscription
router.post('/cancel-subscription', async (req, res) => {
  const { subscriptionId } = req.body;

  // Check if subscriptionId is provided
  if (!subscriptionId) {
    return res.status(400).json({ message: 'Subscription ID is required' });
  }

  try {
    const token = await getPayPalToken();

    // Use the correct subscription cancellation API endpoint with the subscriptionId in the path
    const cancelUrl = `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`;

    await axios.post(
      cancelUrl,
      { reason: 'User requested cancellation' }, // Optional reason for cancellation
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Subscription cancelled successfully' )

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error.response ? error.response.data : error.message);
    res.status(400).json({ message: 'Failed to cancel subscription', error: error.response ? error.response.data : error.message });
  }
});



module.exports = router;
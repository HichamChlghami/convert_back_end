const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_SECRET
const base = process.env.BASE

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

    const response = await axios.post(`${base}/v1/oauth2/token`, 
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const generateClientToken = async () => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/identity/generate-token`;

  const response = await axios.post(url, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response);
};

const createOrder = async (cart) => {
  console.log("Shopping cart information:", cart);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "2.99", // Adjust as needed based on the cart
        },
      },
    ],
  };

  const response = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await axios.post(url, {}, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  if (response.status !== 200 && response.status !== 201) {
    const errorMessage = response.data ? JSON.stringify(response.data) : "Unknown error";
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorMessage}`);
  }

  return {
    jsonResponse: response.data,
    httpStatusCode: response.status,
  };
}

router.post("/api/token", async (req, res) => {
  try {
    const { jsonResponse, httpStatusCode } = await generateClientToken();
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to generate client token:", error);
    res.status(500).send({ error: "Failed to generate client token." });
  }
});

router.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    console.log('jsonResponse', jsonResponse);
    console.log('httpStatusCode', httpStatusCode);

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    console.log('orderID', orderID);

    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    console.log('jsonResponse', jsonResponse);
    console.log('httpStatusCode', httpStatusCode);

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});








module.exports = router;

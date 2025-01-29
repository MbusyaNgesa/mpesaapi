import axios from "axios";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

let token = null;

export const createToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",

      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    token = response.data.access_token;
    console.log("Access Token Response:", response.data);

    next();
  } catch (error) {
    console.error("Error getting access token:", error.message);
    next(error);
  }
};

export const stkPush = async (req, res) => {
  if (!token) {
    return res.status(500).json({
      error: "Token is not available. Please generate a token first.",
    });
  }

  const shortCode = 174379;
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", //till "CustomerBuyGoodsOnline"
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://yourwebsite.co.ke/callbackurl",
    AccountReference: "account",
    TransactionDesc: "test",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("STK Push Response:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in STK Push:", error.message);

    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      return res.status(error.response.status).json({
        error: error.response.data,
      });
    }
    return res.status(500).json({ error: error.message });
  }
};

import axios from "axios";

export const createToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
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

    console.log("Access Token Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw error;
  }
};

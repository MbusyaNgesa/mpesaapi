// Save as mpesaSTK.js
import unirest from "unirest";
import { Buffer } from "buffer";

class MpesaSTK {
  constructor() {
    this.consumerKey = "QPSAo4HXC1mWEduWFg0XZDD1QhfEPpz7bbEke6zeAlmsuiaw";
    this.consumerSecret =
      "0GNqgI2C5WJnpMhYN2fkF3JujaJQ2uTeQAHGuHicbmptDK7luZwSaqAG3rJgO2W8";
    this.baseUrl = "https://sandbox.safaricom.co.ke";
  }

  // Generate auth header
  generateAuthHeader() {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString("base64");
    return `Basic ${auth}`;
  }

  // Get access token with verification
  async getAccessToken() {
    try {
      const response = await unirest
        .get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`)
        .headers({
          Authorization: this.generateAuthHeader(),
        });

      // Log the complete response for debugging
      console.log("Access Token Response:", response.body);

      if (!response.body.access_token) {
        throw new Error("No access token received");
      }

      return response.body.access_token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }

  // STK Push with detailed logging
  async initiateSTKPush() {
    try {
      // Get and verify access token
      const accessToken = await this.getAccessToken();
      console.log("Access Token obtained:", accessToken);

      // Generate timestamp (format: YYYYMMDDHHmmss)
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -6);

      // Business shortcode and passkey for sandbox
      const shortcode = "174379";
      const passkey =
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

      // Generate password (shortcode + passkey + timestamp)
      const password = Buffer.from(shortcode + passkey + timestamp).toString(
        "base64"
      );

      const requestBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: "254794843866",
        PartyB: shortcode,
        PhoneNumber: "254708374149",
        CallBackURL: "https://mydomain.com/callback",
        AccountReference: "Test",
        TransactionDesc: "Test payment",
      };

      // Log request details for debugging
      console.log("STK Push Request Body:", requestBody);

      const response = await unirest
        .post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`)
        .headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        })
        .send(requestBody);

      // Log complete response
      console.log("STK Push Complete Response:", response.body);
      return response.body;
    } catch (error) {
      console.error("Error in STK Push:", error);
      throw error;
    }
  }
}

// Test the implementation
async function testSTK() {
  const mpesa = new MpesaSTK();
  try {
    console.log("Starting STK Push test...");
    const result = await mpesa.initiateSTKPush();
    console.log("Final Result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSTK();

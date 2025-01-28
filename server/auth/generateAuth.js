import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

// Step 1: Combine the consumer key and secret with a colon
const combinedCredentials = `${consumerKey}:${consumerSecret}`;

// Step 2: Convert the combined string to Base64
const base64Credentials = Buffer.from(combinedCredentials).toString("base64");

// Step 3: Add the "Basic" prefix to create the full Authorization header
const authHeader = `Basic ${base64Credentials}`;

console.log("Combined Credentials:", combinedCredentials);
console.log("Base64 Encoded:", base64Credentials);
console.log("Full Authorization Header:", authHeader);

//HOw

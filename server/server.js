import unirest from "unirest";

const getAccessToken = async () => {
  try {
    const response = await unirest
      .get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
      )
      .headers({
        Authorization:
          "Basic UVBTQW80SFhDMW1XRWR1V0ZnMFhaREQxUWhmRVBwejdiYkVrZTZ6ZUFsbXN1aWF3OjBHTnFnSTJDNVdKbnBNaFlOMmZrRjNKdWphSlEydVRlUUFIR3VIaWNibXB0REs3bHVad1NhcUFHM3JKZ08yVzg=",
      });
    // The response will contain your access token
    console.log("Access Token Response:", response.body);
    return response.body;
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw error;
  }
};

// Execute the function
getAccessToken();

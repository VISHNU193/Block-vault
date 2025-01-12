const { PinataSDK } = require("pinata-web3");
const crypto = require("crypto");
require("dotenv").config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

// Generate a strong symmetric key (store it securely, not in code)
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV = crypto.randomBytes(16); // Initialization vector (16 bytes)

function encryptJSON(jsonData) {
  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonData);

  // Create cipher instance
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);

  // Encrypt data
  let encrypted = cipher.update(jsonString, "utf8", "base64");
  encrypted += cipher.final("base64");

  return {
    encryptedData: encrypted,
    iv: IV.toString("base64"), // Store IV to use for decryption
  };
}

async function uploadEncryptedJSON() {
  try {
    // JSON data to encrypt
    const jsonData = {
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a secret message",
    };

    // Encrypt JSON
    const { encryptedData, iv } = encryptJSON(jsonData);

    // Prepare encrypted data as a Blob
    const blob = new Blob(
      [
        JSON.stringify({
          iv, // Store IV alongside encrypted data
          encryptedData,
        }),
      ],
      { type: "application/json" }
    );
    const file = new File([blob], "encrypted-data.json", {
      type: "application/json",
    });

    // Upload to IPFS
    const upload = await pinata.upload.file(file);
    console.log("Encrypted JSON uploaded to IPFS:", upload);
  } catch (error) {
    console.error("Error uploading encrypted JSON:", error);
  }
}

// Call the function
uploadEncryptedJSON();

// Log the encryption key securely
console.log("Encryption Key (store securely):", ENCRYPTION_KEY.toString("base64"));

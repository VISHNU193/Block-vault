const { PinataSDK } = require("pinata-web3");
const crypto = require("crypto");
require("dotenv").config();

function decryptJSON(encryptedJSON, encryptionKey) {
    const { iv, encryptedData } = encryptedJSON;
  
    // Convert IV and encrypted data back to Buffers
    const ivBuffer = Buffer.from(iv, "base64");
    const encryptedBuffer = Buffer.from(encryptedData, "base64");
  
    // Create decipher instance
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, ivBuffer);
  
    // Decrypt data
    let decrypted = decipher.update(encryptedBuffer, "base64", "utf8");
    decrypted += decipher.final("utf8");
  
    // Parse decrypted JSON string
    return JSON.parse(decrypted);
  }
  
// Example of decryption
const encryptedJSON = {
iv: "2ZlPQQv1fOEe4UK5JJ+kMA==",
encryptedData: "Q66kL9LjFlDlJQLHtZo2Kh33Uo3qNEXsHPXgqIOBD9Hdtfb7Ko+KJ5dfZIDao6Q/Ft7ubH5xzu3CetDgYnXrI9d5WUFOYBQb4wfp/Fq3mly+ll4KkLt1pZTe45RDYeXE",
};
const decryptionKey = Buffer.from("64gN0UV33kuerJVOg/NprmqzYR4Sph+fTMrBBmqGuDA=", "base64");
const originalJSON = decryptJSON(encryptedJSON, decryptionKey);
console.log("Decrypted JSON:", originalJSON);

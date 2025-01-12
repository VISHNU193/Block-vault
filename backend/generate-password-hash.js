import crypto from "crypto";
import argon2 from "argon2";

// Function to derive a key using Argon2
async function deriveKey(password, salt) {
  return argon2.hash(password, {
    type: argon2.argon2id,     // Use Argon2id for better protection against side-channel attacks
    memoryCost: 65536,         // Memory cost (64 MB)
    timeCost: 3,               // Iterations
    parallelism: 1,            // Parallel threads
    hashLength: 32,            // Length of derived key (256 bits)
    salt: salt,
    raw: true,                 // Return raw binary format of the key
  });
}

// Function to create an HMAC
function createHMAC(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("hex");
}

// Main function
(async () => {
  try {
    const password = "secure-master-password"; // Example password
    const salt = crypto.randomBytes(16);      // Generate a random 16-byte salt

    // Derive a 256-bit key using Argon2
    const key = await deriveKey(password, salt);

    console.log("Derived Key (Base64):", key.toString("base64")); // Base64-encoded key for readability

    // Create HMAC using the derived key
    const message = "authentication";        // Message to bind with the HMAC
    const authHash = createHMAC(key, message);

    console.log("HMAC Hash:", authHash);
  } catch (error) {
    console.error("Error:", error);
  }
})();

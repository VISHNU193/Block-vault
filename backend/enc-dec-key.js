import crypto from "crypto";
import argon2 from "argon2";

// Function to derive a key using Argon2
async function deriveKey(password, salt) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
    salt: salt,
    raw: true,
  });
}

// Encrypt data using AES-GCM
function encryptData(plaintext, key) {
  const iv = crypto.randomBytes(12); // 12-byte IV for AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    encrypted,
    iv: iv.toString("base64"),
    authTag,
  };
}

// Decrypt data using AES-GCM
function decryptData(encryptedData, key, iv, authTag) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Main function
(async () => {
  try {
    const password = "secure-master-password"; // Example password
    const salt = crypto.randomBytes(16);      // Generate a random salt

    // Derive a 256-bit key using Argon2
    const key = await deriveKey(password, salt);

    console.log("Derived Key (Base64):", key.toString("base64")); // For debugging

    // Encrypt data
    const plaintext = "Sensitive data to encrypt";
    const { encrypted, iv, authTag } = encryptData(plaintext, key);
    console.log("Encrypted Data:", encrypted);
    console.log("IV (Base64):", iv);
    console.log("Auth Tag (Base64):", authTag);

    // Decrypt data
    const decrypted = decryptData(encrypted, key, iv, authTag);
    console.log("Decrypted Data:", decrypted);
  } catch (error) {
    console.error("Error:", error);
  }
})();

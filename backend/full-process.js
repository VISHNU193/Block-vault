

import argon2 from "argon2";
import crypto from "crypto";

// Helper: Derive a key using Argon2id
async function deriveKey(password, salt) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    salt: Buffer.from(salt, "base64"),
    memoryCost: 65536,
    timeCost: 3,
    hashLength: 32,
    raw: true,
  });
}

// Helper: Generate HMAC
function HMAC(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("base64");
}

// Simulated Registration
async function register(masterPassword) {
  console.log("=== Registration Phase ===");

  const salt = crypto.randomBytes(16).toString("base64"); // Generate a unique salt
  console.log("Generated Salt:", salt);

  const key = await deriveKey(masterPassword, salt); // Derive key
  console.log("Derived Key:", key.toString("base64"));

  const authHash = HMAC(key, "authentication"); // Generate authHash
  console.log("Generated AuthHash:", authHash);

  return { salt, authHash };
}

// Simulated Login
async function login(masterPassword, storedSalt, storedAuthHash) {
  console.log("\n=== Login Phase ===");

  const challenge = crypto.randomBytes(16).toString("base64"); // Generate random challenge
  console.log("Generated Challenge:", challenge);

  const key = await deriveKey(masterPassword, storedSalt); // Derive key again
  const authHash = HMAC(key, "authentication"); // Recompute authHash
  console.log("Recomputed AuthHash:", authHash);

  if (authHash !== storedAuthHash) {
    console.log("Authentication Failed: AuthHash mismatch!");
    return false;
  }

  const signature = HMAC(authHash, challenge); // Generate signature
  console.log("Generated Signature:", signature);

  const validSignature = HMAC(storedAuthHash, challenge); // Server-side validation
  console.log("Valid Signature (Server):", validSignature);

  if (signature === validSignature) {
    console.log("Authentication Successful!");
    return true;
  } else {
    console.log("Authentication Failed: Signature mismatch!");
    return false;
  }
}

// Demonstration
(async () => {
  const masterPassword = "super_secure_password";

  // Registration
  const { salt, authHash } = await register(masterPassword);

  // Simulate storing and retrieving salt/authHash
  const storedSalt = salt; // Retrieved from database
  const storedAuthHash = authHash; // Retrieved from database

  // Login
  await login(masterPassword, storedSalt, storedAuthHash);
})();

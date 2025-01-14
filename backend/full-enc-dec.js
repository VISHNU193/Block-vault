// // Helper: Convert ArrayBuffer to Base64
// const arrayBufferToBase64 = (buffer) => {
//     return btoa(String.fromCharCode(...new Uint8Array(buffer)));
//   };
  
//   // Helper: Convert Base64 to ArrayBuffer
//   const base64ToArrayBuffer = (base64) => {
//     return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
//   };
  


//   const deriveKeyPBKDF2 = async (password, salt) => {
//     const encoder = new TextEncoder();
//     const passwordBuffer = encoder.encode(password);
//     const saltBuffer = encoder.encode(salt);

//     const keyMaterial = await crypto.subtle.importKey(
//       "raw",
//       passwordBuffer,
//       { name: "PBKDF2" },
//       false,
//       ["deriveBits", "deriveKey"]
//     );

//     const derivedKey = await crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt: saltBuffer,
//         iterations: 100000,
//         hash: "SHA-256",
//       },
//       keyMaterial,
//       { name: "HMAC", hash: "SHA-256", length: 256 },
//       false,
//       ["sign"]
//     );

//     return derivedKey;
//   };

//   // Helper: Generate HMAC (Hash-based Message Authentication Code)
//   const HMAC = async (key, message) => {
//     const encoder = new TextEncoder();
//     const messageBuffer = encoder.encode(message);

//     const signature = await crypto.subtle.sign("HMAC", key, messageBuffer);
//     const hashArray = new Uint8Array(signature);
//     const hashBase64 = btoa(String.fromCharCode(...hashArray));
//     return hashBase64;
//   };

//   // Encrypt function
//   const encryptData = async (key, data) => {
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random 12-byte IV
//     const encoder = new TextEncoder();
//     const dataBuffer = encoder.encode(data); // Convert data to ArrayBuffer
  
//     const encrypted = await crypto.subtle.encrypt(
//       {
//         name: "AES-GCM",
//         iv, // Initialization vector
//       },
//       key, // Derived key
//       dataBuffer // Data to encrypt
//     );
  
//     return {
//       iv: arrayBufferToBase64(iv), // Return IV as Base64
//       ciphertext: arrayBufferToBase64(encrypted), // Return encrypted data as Base64
//     };
//   };
  
//   // Decrypt function
//   const decryptData = async (key, ivBase64, ciphertextBase64) => {
//     const iv = base64ToArrayBuffer(ivBase64); // Convert IV back to ArrayBuffer
//     const ciphertext = base64ToArrayBuffer(ciphertextBase64); // Convert ciphertext back to ArrayBuffer
  
//     const decrypted = await crypto.subtle.decrypt(
//       {
//         name: "AES-GCM",
//         iv, // Use the same IV as during encryption
//       },
//       key, // Derived key
//       ciphertext // Ciphertext to decrypt
//     );
  
//     const decoder = new TextDecoder();
//     return decoder.decode(decrypted); // Convert decrypted ArrayBuffer back to string
//   };
  
//   // Example usage
//   const exampleEncryption = async () => {
//     const password = "your_password";
//     const salt = "your_salt"; // Use the same salt as before
//     const dataToEncrypt = "Sensitive data to encrypt";
  
//     // Derive key using PBKDF2
//     const derivedKey = await deriveKeyPBKDF2(password, salt);
  
//     // Encrypt data
//     const { iv, ciphertext } = await encryptData(derivedKey, dataToEncrypt);
//     console.log("Encrypted Data:", { iv, ciphertext });
  
//     // Decrypt data
//     const decryptedData = await decryptData(derivedKey, iv, ciphertext);
//     console.log("Decrypted Data:", decryptedData);
//   };
  
//   exampleEncryption();
  



import crypto from 'crypto'

// Helper: Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

// Helper: Convert Base64 to Buffer
const base64ToArrayBuffer = (base64) => {
  return Buffer.from(base64, "base64");
};

// Derive key using PBKDF2
const deriveKeyPBKDF2 = async (password, salt) => {
  return new Promise((resolve, reject) => {
    const iterations = 100000;
    const keyLength = 32; // AES-256 requires a 256-bit (32-byte) key
    const hashAlgorithm = "sha256";

    crypto.pbkdf2(password, salt, iterations, keyLength, hashAlgorithm, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey); // Return the derived key as a Buffer
    });
  });
};

// Encrypt function using AES-GCM
const encryptData = async (key, data) => {
  const iv = crypto.randomBytes(12); // Generate a random 12-byte IV
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    iv: iv.toString("base64"), // IV in Base64
    ciphertext: encrypted, // Encrypted data in Base64
    authTag, // Authentication tag in Base64
  };
};

// Decrypt function using AES-GCM
const decryptData = async (key, ivBase64, ciphertextBase64, authTagBase64) => {
  const iv = base64ToArrayBuffer(ivBase64); // Convert IV from Base64
  const authTag = base64ToArrayBuffer(authTagBase64); // Convert authTag from Base64

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag); // Set the authentication tag

  let decrypted = decipher.update(ciphertextBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted; // Return the decrypted data as a string
};

// Example usage
const exampleEncryption = async () => {
  const password = "z";
  const salt = "9LfjYEkhDwVrD+ImMTRI0Q=="; // Use a securely generated random salt
  const dataToEncrypt = "[{\"url\":\"a\",\"username\":\"b\",\"password\":\"c\"},{\"url\":\"fdghsfd\",\"username\":\"fgjfgh\",\"password\":\"ghjhkj\"}]";

  // Derive key using PBKDF2
  const derivedKey = await deriveKeyPBKDF2(password, salt);

  // Encrypt data
  const { iv, ciphertext, authTag } = await encryptData(derivedKey, dataToEncrypt);
  console.log("Encrypted Data:", { iv, ciphertext, authTag });

  // Decrypt data
  const decryptedData = await decryptData(derivedKey, iv, ciphertext, authTag);
  console.log("Decrypted Data:", decryptedData);
};

exampleEncryption().catch((err) => console.error("Error:", err));

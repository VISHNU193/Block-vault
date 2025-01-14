



// const deriveMasterKeyPBKDF2 = async (password, salt) => {
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
  
//     const derivedBits = await crypto.subtle.deriveBits(
//       {
//         name: "PBKDF2",
//         salt: saltBuffer,
//         iterations: 100000,
//         hash: "SHA-256",
//       },
//       keyMaterial,
//       256 // Length in bits
//     );
  
//     // Import the derived bits as a key
//     const masterKey = await crypto.subtle.importKey(
//       "raw",
//       derivedBits,
//       { name: "HKDF" }, // Using HKDF to split later
//       false,
//       ["deriveKey"]
//     );
  
//     return masterKey;
//   };
  





//   const deriveKeysFromMaster = async (masterKey) => {
//     const encoder = new TextEncoder();
  
//     // Derive AES-GCM Key
//     const aesKey = await crypto.subtle.deriveKey(
//       {
//         name: "HKDF",
//         hash: "SHA-256",
//         salt: encoder.encode("aes-gcm-salt"), // Different salts ensure unique keys
//         info: encoder.encode("aes-gcm"),
//       },
//       masterKey,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["encrypt", "decrypt"]
//     );
  
//     // Derive HMAC Key
//     const hmacKey = await crypto.subtle.deriveKey(
//       {
//         name: "HKDF",
//         hash: "SHA-256",
//         salt: encoder.encode("hmac-salt"),
//         info: encoder.encode("hmac"),
//       },
//       masterKey,
//       { name: "HMAC", hash: "SHA-256", length: 256 },
//       false,
//       ["sign"]
//     );
  
//     return { aesKey, hmacKey };
//   };















// const encryptData = async (aesKey, data) => {
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
//     const encoder = new TextEncoder();
//     const dataBuffer = encoder.encode(JSON.stringify(data));
  
//     const encrypted = await crypto.subtle.encrypt(
//       {
//         name: "AES-GCM",
//         iv,
//       },
//       aesKey,
//       dataBuffer
//     );
  
//     return {
//       iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
//       ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
//     };
//   };

//   const decryptData = async (aesKey, encryptedData) => {
//     const { iv, ciphertext } = encryptedData;
  
//     // Convert Base64 back to Uint8Array
//     const ivArray = Uint8Array.from(atob(iv), (char) => char.charCodeAt(0));
//     const ciphertextArray = Uint8Array.from(atob(ciphertext), (char) => char.charCodeAt(0));
  
//     const decrypted = await crypto.subtle.decrypt(
//       {
//         name: "AES-GCM",
//         iv: ivArray,
//       },
//       aesKey,
//       ciphertextArray
//     );
  
//     const decoder = new TextDecoder();
//     return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
//   };




// const mK = await deriveMasterKeyPBKDF2("b","y7rBl5+kpzwVOiua2qelbw==")
// console.log(mK);

// const {aesKey,hmacKey} = await deriveKeysFromMaster(mK)
// console.log(aesKey);
// console.log(hmacKey);

// const {iv,ciphertext} = await encryptData(aesKey,[])

// console.log(iv);
// console.log(ciphertext);


// const res = await decryptData(aesKey,{iv,ciphertext})
// console.log(res);



// The issue is likely due to the differences in the Web Cryptography API (W3C) implementation between Node.js and browsers.
// In Node.js, you're using the crypto module, which provides a different API than the Web Cryptography API used in browsers.
// To make your code work in browsers, you'll need to use the Web Cryptography API, which is supported by most modern browsers.
// Here are the changes you'll need to make:
// Replace crypto.subtle with window.crypto.subtle (or self.crypto.subtle in Web Workers).
// Use the TextEncoder and TextDecoder APIs to convert between strings and typed arrays.
// Use the btoa and atob functions to convert between base64 strings and typed arrays.
// Here's an updated version of your code that should work in browsers:
// JavaScript
async function deriveMasterKeyPBKDF2(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // Length in bits
  );

  // Import the derived bits as a key
  const masterKey = await window.crypto.subtle.importKey(
    "raw",
    derivedBits,
    { name: "HKDF" }, // Using HKDF to split later
    false,
    ["deriveKey"]
  );

  return masterKey;
}

async function deriveKeysFromMaster(masterKey) {
  const encoder = new TextEncoder();

  // Derive AES-GCM Key
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode("aes-gcm-salt"), // Different salts ensure unique keys
      info: encoder.encode("aes-gcm"),
    },
    masterKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  // Derive HMAC Key
  const hmacKey = await window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode("hmac-salt"),
      info: encoder.encode("hmac"),
    },
    masterKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"]
  );

  return { aesKey, hmacKey };
}

async function encryptData(aesKey, data) {
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    dataBuffer
  );

  return {
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  };
}

async function decryptData(aesKey, encryptedData) {
  const { iv, ciphertext } = encryptedData;

  // Convert Base64 back to Uint8Array
  const ivArray = new Uint8Array(atob(iv).split("").map((char) => char.charCodeAt(0)));
  const ciphertextArray = new Uint8Array(atob(ciphertext).split("").map((char) => char.charCodeAt(0)));

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    aesKey,
    ciphertextArray
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
}

// Usage
async function main() {
  const mK = await deriveMasterKeyPBKDF2("b", "y7rBl5+kpzwVOiua2qelbw==");
  console.log(mK);

  const { aesKey, hmacKey } = await deriveKeysFromMaster(mK);
  console.log(aesKey);
  console.log(hmacKey);

  const { iv, ciphertext } = await encryptData(aesKey, []);
  console.log(iv);
  console.log(ciphertext);

  const res = await decryptData(aesKey, { iv, ciphertext });
  console.log(res);
}

main();
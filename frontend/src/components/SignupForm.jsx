// // // import { useState } from "react";
// // // import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
// // // import axios from "axios";
// // // import * as argon2 from "argon2-browser";
// // // import { Buffer } from 'buffer';
// // // import * as crypto from 'crypto-browserify';
// // // const SignupForm = () => {
// // //   const [formData, setFormData] = useState({
// // //     username: "",
// // //     email: "",
// // //     password: "",
// // //   });

// // //   const [error, setError] = useState("");
// // //   const navigate = useNavigate();
// // //   const [message, setMessage] = useState("");


// // //   // const deriveKey = async (password, salt) => {
// // //   //   const derivedKey = await argon2.hash({
// // //   //     pass: password,
// // //   //     salt,
// // //   //     type: argon2.ArgonType.Argon2id,
// // //   //     hashLen: 32,
// // //   //     mem: 65536,
// // //   //     time: 3,
// // //   //     parallelism: 1,
// // //   //     raw: true,
// // //   //   });
// // //   //   return derivedKey;
// // //   // };

// // //   // const encryptData = (data, key) => {
// // //   //   const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
// // //   //   const cipher = crypto.subtle.encrypt(
// // //   //     {
// // //   //       name: "AES-GCM",
// // //   //       iv,
// // //   //     },
// // //   //     key,
// // //   //     new TextEncoder().encode(data)
// // //   //   );
// // //   //   return { cipher, iv };
// // //   // };


// // //   // Helper: Derive a key using Argon2id
// // // async function deriveKey(password, salt) {
// // //   return argon2.hash(password, {
// // //     type: argon2.argon2id,
// // //     salt: Buffer.from(salt, "base64"),
// // //     memoryCost: 65536,
// // //     timeCost: 3,
// // //     hashLength: 32,
// // //     raw: true,
// // //   });
// // // }

// // // // Helper: Generate HMAC
// // // function HMAC(key, message) {
// // //   return crypto.createHmac("sha256", key).update(message).digest("base64");
// // // }

// // //   // Handle form data change
// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prevState) => ({
// // //       ...prevState,
// // //       [name]: value,
// // //     }));
// // //   };

// // //   // Handle form submission
// // //   // const handleSubmit = (e) => {
// // //   //   e.preventDefault();

// // //   //   // Simple validation
// // //   //   if (!formData.username || !formData.email || !formData.password) {
// // //   //     setError("All fields are required!");
// // //   //     return;
// // //   //   }

// // //   //   // Placeholder: Logic to submit form (e.g., to an API or backend)
// // //   //   console.log("User Signed Up:", formData);

// // //   //   // Redirect to login page after signup
// // //   //   navigate("/");
// // //   // };


// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       // const salt = crypto.getRandomValues(new Uint8Array(16)); // Random salt
// // //       // const derivedKey = await deriveKey(formData.password, salt);

// // //       // // Create authHash (e.g., HMAC-SHA256)
// // //       // const authHash = await crypto.subtle.sign(
// // //       //   "HMAC",
// // //       //   derivedKey,
// // //       //   new TextEncoder().encode("authentication")
// // //       // );



// // //       console.log("here");
      
// // //       const salt = crypto.randomBytes(16).toString("base64"); // Generate a unique salt
// // //       const key = await deriveKey(formData.password, salt); // Derive key
// // //       const authHash = HMAC(key, "authentication"); // Generate authHash

// // //       console.log(salt);
// // //       console.log(key);
// // //       console.log(authHash);
      


// // //       // // Encrypt credentials
// // //       // const credentials = JSON.stringify(JSON.parse(formData.credentials));
// // //       // const { cipher, iv } = encryptData(credentials, derivedKey);

// // //       // Send data to the server
// // //       const response = await axios.post("http://localhost:5000/api/register", {
// // //         username: formData.username,
// // //         email: formData.email,
// // //         authHash: Buffer.from(authHash).toString("base64"),
// // //         // encrypted: Buffer.from(cipher).toString("base64"),
// // //         // iv: Buffer.from(iv).toString("base64"),
// // //         salt: Buffer.from(salt).toString("base64"),
// // //       });
// // //       setMessage(response.data.message);
// // //     } catch (error) {
// // //       setMessage(error.response?.data?.message || "Error occurred during registration.");
// // //     }
// // //   };

// // //   return (
// // //     <div className="form-container">
// // //       <h2>SignUp</h2>
// // //       {error && <p style={{ color: "red" }}>{error}</p>}
// // //       <form onSubmit={handleSubmit}>
// // //         <input
// // //           type="text"
// // //           name="username"
// // //           placeholder="Username"
// // //           value={formData.username}
// // //           onChange={handleChange}
// // //         />
// // //         <input
// // //           type="email"
// // //           name="email"
// // //           placeholder="Email"
// // //           value={formData.email}
// // //           onChange={handleChange}
// // //         />
// // //         <input
// // //           type="password"
// // //           name="password"
// // //           placeholder="Password"
// // //           value={formData.password}
// // //           onChange={handleChange}
// // //         />
// // //         <button type="submit" >Sign Up</button>
// // //       </form>
// // //       {message && <p>{message}</p>}
// // //       <p>
// // //         Already have an account?{" "}
// // //         <span style={{ color: "#28a745" }} onClick={() => navigate("/")} >Login</span>
// // //       </p>
// // //     </div>
// // //   );
// // // };

// // // export default SignupForm;

// // // // import React from 'react'

// // // // const SignupForm = () => {
// // // //   return (
// // // //     <div>SignupForm</div>
// // // //   )
// // // // }

// // // // export default SignupForm;







// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
// // import axios from "axios";
// // const argon2 = await import("argon2-browser");
// // // Browser-compatible Argon2 library

// // const SignupForm = () => {
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //   });

// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();
// //   const [message, setMessage] = useState("");

// //   // Helper: Derive a key using Argon2id
// //   async function deriveKey(password, salt) {
// //     const derivedKey = await argon2.hash({
// //       pass: password,
// //       salt: salt,
// //       type: argon2.ArgonType.Argon2id,
// //       hashLen: 32,
// //       mem: 65536,
// //       time: 3,
// //       parallelism: 1,
// //       raw: true,
// //     });
// //     return derivedKey;
// //   }

// //   // Helper: Generate HMAC (using window.crypto in the browser)
// //   function HMAC(key, message) {
// //     const encoder = new TextEncoder();
// //     const keyBuffer = encoder.encode(key);
// //     const messageBuffer = encoder.encode(message);
    
// //     return window.crypto.subtle.importKey(
// //       "raw",
// //       keyBuffer,
// //       { name: "HMAC", hash: { name: "SHA-256" } },
// //       false,
// //       ["sign"]
// //     )
// //     .then(importedKey => {
// //       return window.crypto.subtle.sign("HMAC", importedKey, messageBuffer);
// //     })
// //     .then(signature => {
// //       return btoa(String.fromCharCode(...new Uint8Array(signature))); // Convert to base64
// //     });
// //   }

// //   // Handle form data change
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       [name]: value,
// //     }));
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       // Generate a unique salt (using window.crypto)
// //       const saltArray = new Uint8Array(16);
// //       window.crypto.getRandomValues(saltArray);
// //       const salt = btoa(String.fromCharCode(...saltArray)); // Convert to base64

// //       // Derive key using Argon2
// //       const key = await deriveKey(formData.password, salt);

// //       // Generate authHash using HMAC
// //       const authHash = await HMAC(key, "authentication");

// //       // Send data to the server
// //       const response = await axios.post("http://localhost:5000/api/register", {
// //         username: formData.username,
// //         email: formData.email,
// //         authHash: authHash, // Send the HMAC result directly
// //         salt: salt,
// //       });

// //       setMessage(response.data.message);
// //     } catch (error) {
// //       setMessage(error.response?.data?.message || "Error occurred during registration.");
// //     }
// //   };

// //   return (
// //     <div className="form-container">
// //       <h2>SignUp</h2>
// //       {error && <p style={{ color: "red" }}>{error}</p>}
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           name="username"
// //           placeholder="Username"
// //           value={formData.username}
// //           onChange={handleChange}
// //         />
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={formData.email}
// //           onChange={handleChange}
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password"
// //           value={formData.password}
// //           onChange={handleChange}
// //         />
// //         <button type="submit">Sign Up</button>
// //       </form>
// //       {message && <p>{message}</p>}
// //       <p>
// //         Already have an account?{" "}
// //         <span style={{ color: "#28a745" }} onClick={() => navigate("/")} >
// //           Login
// //         </span>
// //       </p>
// //     </div>
// //   );
// // };

// // export default SignupForm;






// import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
// import axios from "axios";

// const SignupForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");

//   // Helper: Derive a key using PBKDF2
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


//   const arrayBufferToBase64 = (buffer) =>
//     btoa(String.fromCharCode(...new Uint8Array(buffer)));
  
//   // Helper: Encrypt data
//   const encryptData = async (key, data) => {
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
//     const encoder = new TextEncoder();
//     const dataBuffer = encoder.encode(JSON.stringify(data)); // Convert data to string
  
//     const encrypted = await crypto.subtle.encrypt(
//       {
//         name: "AES-GCM",
//         iv,
//       },
//       key,
//       dataBuffer
//     );
  
//     return {
//       iv: arrayBufferToBase64(iv),
//       ciphertext: arrayBufferToBase64(encrypted),
//     };
//   };

//   // Handle form data change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Generate salt and derive key
//       const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate random salt
//       const saltBase64 = btoa(String.fromCharCode(...salt));

//       const derivedKey = await deriveKeyPBKDF2(formData.password, saltBase64);
//       const authHash = await HMAC(derivedKey, "authentication");

//       const {iv, ciphertext} = await encryptData(derivedKey,[]);

//       console.log(salt);
//       console.log(saltBase64);
//       console.log(derivedKey);
//       console.log(authHash);
//       console.log(iv);
//       console.log(ciphertext);
      
      

//       // Send data to the server
//       const response = await axios.post("http://localhost:5000/api/register", {
//         username: formData.username,
//         email: formData.email,
//         authHash: authHash, // Store the authHash (HMAC)
//         salt: saltBase64,
//         iv:iv,
//         ciphertext:ciphertext
//       });
//       setMessage(response.data.message);
//       navigate("/");
//     } catch (error) {
//       console.log(error);
      
//       setMessage(error.response?.data?.message || "Error occurred during registration.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>SignUp</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//       {message && <p>{message}</p>}
//       <p>
//         Already have an account?{" "}
//         <span style={{ color: "#28a745" }} onClick={() => navigate("/")} >Login</span>
//       </p>
//     </div>
//   );
// };

// export default SignupForm;






import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
import axios from "axios";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // const [error, setError] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Helper: Derive a key using PBKDF2
  // const deriveMasterKeyPBKDF2 = async (password, salt) => {
  //   const encoder = new TextEncoder();
  //   const passwordBuffer = encoder.encode(password);
  //   const saltBuffer = encoder.encode(salt);
  
  //   const keyMaterial = await crypto.subtle.importKey(
  //     "raw",
  //     passwordBuffer,
  //     { name: "PBKDF2" },
  //     false,
  //     ["deriveBits", "deriveKey"]
  //   );
  
  //   const masterKey = await crypto.subtle.deriveKey(
  //     {
  //       name: "PBKDF2",
  //       salt: saltBuffer,
  //       iterations: 100000,
  //       hash: "SHA-256",
  //     },
  //     keyMaterial,
  //     { name: "HKDF", length: 256 }, // 256-bit master key
  //     false,
  //     ["deriveKey"]
  //   );
  
  //   return masterKey;
  // };



  const deriveMasterKeyPBKDF2 = async (password, salt) => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);
  
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  
    const derivedBits = await crypto.subtle.deriveBits(
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
    const masterKey = await crypto.subtle.importKey(
      "raw",
      derivedBits,
      { name: "HKDF" }, // Using HKDF to split later
      false,
      ["deriveKey"]
    );
  
    return masterKey;
  };
  





  const deriveKeysFromMaster = async (masterKey) => {
    const encoder = new TextEncoder();
  
    // Derive AES-GCM Key
    const aesKey = await crypto.subtle.deriveKey(
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
    const hmacKey = await crypto.subtle.deriveKey(
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
  };
  


  
  // Helper: Generate HMAC (Hash-based Message Authentication Code)
  const HMAC = async (hmacKey, message) => {
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(message);
  
    const signature = await crypto.subtle.sign("HMAC", hmacKey, messageBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  };
  


  // const arrayBufferToBase64 = (buffer) =>
  //   btoa(String.fromCharCode(...new Uint8Array(buffer)));
  
  // Helper: Encrypt data
  // const encryptData = async (aesKey, data) => {
  //   const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
  //   const encoder = new TextEncoder();
  //   const dataBuffer = encoder.encode(JSON.stringify(data));
  
  //   const encrypted = await crypto.subtle.encrypt(
  //     {
  //       name: "AES-GCM",
  //       iv,
  //     },
  //     aesKey,
  //     dataBuffer
  //   );
  
  //   return {
  //     iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
  //     ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  //   };
  // };











  // async function encryptData(aesKey, data) {
  //   const iv = new Uint8Array(12);
  //   window.crypto.getRandomValues(iv);
  //   const encoder = new TextEncoder();
  //   const dataBuffer = encoder.encode(JSON.stringify(data));
  
  //   const encrypted = await window.crypto.subtle.encrypt(
  //     {
  //       name: "AES-GCM",
  //       iv,
  //     },
  //     aesKey,
  //     dataBuffer
  //   );
  
  //   return {
  //     iv: btoa(String.fromCharCode(...iv)),
  //     ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  //   };
  // }
  
  // async function decryptData(aesKey, encryptedData) {
  //   const { iv, ciphertext } = encryptedData;
  
  //   // Convert Base64 back to Uint8Array
  //   const ivArray = new Uint8Array(atob(iv).split("").map((char) => char.charCodeAt(0)));
  //   const ciphertextArray = new Uint8Array(atob(ciphertext).split("").map((char) => char.charCodeAt(0)));
  
  //   const decrypted = await window.crypto.subtle.decrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: ivArray,
  //     },
  //     aesKey,
  //     ciphertextArray
  //   );
  
  //   const decoder = new TextDecoder();
  //   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
  // }




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
  
    const encodedIv = btoa(String.fromCharCode(...iv));
    const encodedCiphertext = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  
    return {
      iv: encodedIv,
      ciphertext: encodedCiphertext,
    };
  }
  
  async function decryptData(aesKey, encryptedData) {
    const { iv, ciphertext } = encryptedData;
  
    const decodedIv = new Uint8Array(atob(iv).split('').map(char => char.charCodeAt(0)));
    const decodedCiphertext = new Uint8Array(atob(ciphertext).split('').map(char => char.charCodeAt(0)));
  
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decodedIv,
      },
      aesKey,
      decodedCiphertext
    );
  
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
  }














  // Helper function to convert Uint8Array to Base64
  // const encryptData = async (aesKey, data) => {
  //   // Generate a random IV (Initialization Vector)
  //   const iv = crypto.getRandomValues(new Uint8Array(12));
  //   const encoder = new TextEncoder();
  //   const dataBuffer = encoder.encode(JSON.stringify(data));
  
  //   const encrypted = await crypto.subtle.encrypt(
  //     {
  //       name: "AES-GCM",
  //       iv,
  //     },
  //     aesKey,
  //     dataBuffer
  //   );
  
  //   // Convert IV and encrypted data to Base64
  //   return {
  //     iv: base64Encode(iv), // Proper Base64 encoding for binary data
  //     ciphertext: base64Encode(new Uint8Array(encrypted)),
  //   };
  // };
  
  // const decryptData = async (aesKey, encryptedData) => {
  //   const { iv, ciphertext } = encryptedData;
  
  //   // Decode Base64 strings back into Uint8Array
  //   const ivArray = base64Decode(iv);
  //   const ciphertextArray = base64Decode(ciphertext);
  
  //   const decrypted = await crypto.subtle.decrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: ivArray,
  //     },
  //     aesKey,
  //     ciphertextArray
  //   );
  
  //   const decoder = new TextDecoder();
  //   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
  // };
  
  // // Utility function to Base64 encode binary data
  // const base64Encode = (buffer) => {
  //   return btoa(
  //     String.fromCharCode(...new Uint8Array(buffer))
  //   );
  // };
  
  // // Utility function to Base64 decode into binary data
  // const base64Decode = (base64String) => {
  //   return Uint8Array.from(
  //     atob(base64String),
  //     (char) => char.charCodeAt(0)
  //   );
  // };
  

  




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form data change
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = btoa(String.fromCharCode(...salt));

    const masterKey = await deriveMasterKeyPBKDF2(formData.password, saltBase64);
    const { aesKey, hmacKey } = await deriveKeysFromMaster(masterKey);

    // Generate HMAC
    const authHash = await HMAC(hmacKey, "authentication");

    // Encrypt empty array
    const { iv, ciphertext } = await encryptData(aesKey, []);

    console.log("Auth Hash:", authHash);
    console.log("IV:", iv);
    console.log("Ciphertext:", ciphertext);
    console.log("salt :",saltBase64);
    console.log("aesKey: ",aesKey);
    console.log("hmacKey:",hmacKey);
    

    const response = await axios.post("http://localhost:5000/api/register", {
      username: formData.username,
      email: formData.email,
      authHash,
      salt: saltBase64,
      iv,
      ciphertext,
    });

    setMessage(response.data.message);
    navigate("/");
  } catch (error) {
    console.error(error);
    setMessage(error.response?.data?.message || "Error occurred during registration.");
  }
};


  return (
    <div className="form-container">
      <h2>SignUp</h2>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account?{" "}
        <span style={{ color: "#28a745" }} onClick={() => navigate("/")} >Login</span>
      </p>
    </div>
  );
};

export default SignupForm;





// // import React, { useState, useContext } from "react";
// // import { AuthContext } from "../context/AuthContext";

// // const LoginForm = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const { login } = useContext(AuthContext);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     login(email, password);  // Call the login function from AuthContext
// //   };

// //   return (
// //     <div className="form-container">
// //       <h2>Login</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />
// //         <button type="submit">Login</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default LoginForm;
    

// import { useState,useContext } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
// import axios from "axios";
// import { GlobalContext } from "../context/GlobalContext";
// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const { globalState, setGlobalState } = useContext(GlobalContext);
//   // const setEmail = (email) => {
//   //   setGlobalState({ ...globalState, email });
//   // };

//   // const setKey = (key) => {
//   //   setGlobalState({ ...globalState, key });
//   // };

//   const setEmail = (email) => {
//     setGlobalState((prevState) => ({ ...prevState, email }));
//   };

//   const setKey = (key) => {
//     setGlobalState((prevState) => ({ ...prevState, key }));
//   };

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
//       // Fetch salt from the server based on the email
//       const response = await axios.post("http://localhost:5000/api/get-salt", {
//         email: formData.email,
//       });

//       const { salt } = response.data;
//       console.log(salt);
      
//       if (!salt) {
//         setError("User not found.");
//         return;
//       }

//       // Derive key using PBKDF2 and the retrieved salt
//       const derivedKey = await deriveKeyPBKDF2(formData.password, salt);
      

//       setEmail(formData.email)
//       setKey(derivedKey)

//       console.log(globalState.email);
//       console.log(derivedKey);
      
      
//       // Generate authHash using HMAC (using a constant message)
//       const authHash = await HMAC(derivedKey, "authentication");

//       // Send login request with the derived authHash
//       console.log(`email : ${formData.email}`);
//       console.log(`authHash : ${authHash}`);
//       const loginResponse = await axios.post("http://localhost:5000/api/login", {
//         email: formData.email,
//         computedAuthHash: authHash, // Send the HMAC result directly
//       });

//       setMessage(loginResponse.data.message);
//       if (loginResponse.data.message === "Login successful.") {
//         // Redirect to the dashboard or home page
//         navigate("/vault");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error occurred during login.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
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
//         <button type="submit">Login</button>
//       </form>
//       {message && <p>{message}</p>}
//       {/* <p>
//         Don&apos;t have an account?{" "}
//         <span
//           style={{ color: "#28a745" }}
//           onClick={() => navigate("/signup")}
//         >
//           Sign Up
//         </span>
//       </p> */}
//     </div>
//   );
// };

// export default LoginForm;



import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { globalState, setGlobalState } = useContext(GlobalContext);

  const setEmail = (email) => {
    setGlobalState((prevState) => ({ ...prevState, email }));
  };

  const setAESKey = (aesKey) => {
    setGlobalState((prevState) => ({ ...prevState, aesKey }));
  };

  const setHMACKey = (hmacKey) => {
    setGlobalState((prevState) => ({ ...prevState, hmacKey }));
  };

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Helper: Derive a master key using PBKDF2
  // const deriveMasterKeyPBKDF2 = async (password, salt) => {
  //   const encoder = new TextEncoder();
  //   const passwordBuffer = encoder.encode(password);
  //   const saltBuffer = encoder.encode(salt);

  //   const keyMaterial = await crypto.subtle.importKey(
  //     "raw",
  //     passwordBuffer,
  //     { name: "PBKDF2" },
  //     false,
  //     ["deriveBits"]
  //   );

  //   const derivedBits = await crypto.subtle.deriveBits(
  //     {
  //       name: "PBKDF2",
  //       salt: saltBuffer,
  //       iterations: 100000,
  //       hash: "SHA-256",
  //     },
  //     keyMaterial,
  //     512 // Derive 512 bits (256 bits for AES, 256 bits for HMAC)
  //   );

  //   return derivedBits;
  // };

  // // Helper: Split master key into AES and HMAC keys
  // const splitMasterKey = async (masterKeyBits) => {
  //   const aesKeyBits = masterKeyBits.slice(0, 32); // First 32 bytes (256 bits) for AES
  //   const hmacKeyBits = masterKeyBits.slice(32); // Next 32 bytes (256 bits) for HMAC

  //   const aesKey = await crypto.subtle.importKey(
  //     "raw",
  //     aesKeyBits,
  //     { name: "AES-GCM" },
  //     false,
  //     ["encrypt", "decrypt"]
  //   );

  //   const hmacKey = await crypto.subtle.importKey(
  //     "raw",
  //     hmacKeyBits,
  //     { name: "HMAC", hash: "SHA-256" },
  //     false,
  //     ["sign"]
  //   );

  //   return { aesKey, hmacKey };
  // };

  // // Helper: Generate HMAC (Hash-based Message Authentication Code)
  // const generateHMAC = async (hmacKey, message) => {
  //   const encoder = new TextEncoder();
  //   const messageBuffer = encoder.encode(message);

  //   const signature = await crypto.subtle.sign("HMAC", hmacKey, messageBuffer);
  //   const hashArray = new Uint8Array(signature);
  //   const hashBase64 = btoa(String.fromCharCode(...hashArray));
  //   return hashBase64;
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

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch salt from the server based on the email
      const response = await axios.post("http://localhost:5000/api/get-salt", {
        email: formData.email,
      });

      const { salt } = response.data;

      if (!salt) {
        setError("User not found.");
        return;
      }

      // // Derive master key using PBKDF2 and the retrieved salt
      // const masterKeyBits = await deriveMasterKeyPBKDF2(formData.password, salt);

      // // Split the master key into AES and HMAC keys
      // const { aesKey, hmacKey } = await splitMasterKey(masterKeyBits);


      const masterKey = await deriveMasterKeyPBKDF2(formData.password, salt);
      const { aesKey, hmacKey } = await deriveKeysFromMaster(masterKey);
  
      // Generate HMAC
      const authHash = await HMAC(hmacKey, "authentication");

      // Save AES and HMAC keys in global state
      await setEmail(formData.email);
      await setAESKey(aesKey);
      await setHMACKey(hmacKey);


      
      

      console.log(`login hmacKey :${hmacKey}, aesKey: ${aesKey}`);
      console.log(hmacKey);
      console.log(aesKey);
      
      console.log(globalState.email);
      console.log(globalState.aesKey);
      console.log(globalState.hmacKey);
      // Generate authHash using HMAC key
      // const authHash = await generateHMAC(hmacKey, "authentication");
      console.log(authHash);
      
      // Send login request with the derived authHash
      const loginResponse = await axios.post("http://localhost:5000/api/login", {
        email: formData.email,
        computedAuthHash: authHash, // Send the HMAC result directly
      });

      setMessage(loginResponse.data.message);
      if (loginResponse.data.message === "Login successful.") {
        // Redirect to the dashboard or home page
        navigate("/vault");
      }
    } catch (error) {
      console.log(error);
      
      setMessage(error.response?.data?.message || "Error occurred during login.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;


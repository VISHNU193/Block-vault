
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





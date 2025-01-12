// import React, { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useContext(AuthContext);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login(email, password);  // Call the login function from AuthContext
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;
    

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for redirecting
import axios from "axios";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Helper: Derive a key using PBKDF2
  const deriveKeyPBKDF2 = async (password, salt) => {
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

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "HMAC", hash: "SHA-256", length: 256 },
      false,
      ["sign"]
    );

    return derivedKey;
  };

  // Helper: Generate HMAC (Hash-based Message Authentication Code)
  const HMAC = async (key, message) => {
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(message);

    const signature = await crypto.subtle.sign("HMAC", key, messageBuffer);
    const hashArray = new Uint8Array(signature);
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    return hashBase64;
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
      console.log(salt);
      
      if (!salt) {
        setError("User not found.");
        return;
      }

      // Derive key using PBKDF2 and the retrieved salt
      const derivedKey = await deriveKeyPBKDF2(formData.password, salt);

      // Generate authHash using HMAC (using a constant message)
      const authHash = await HMAC(derivedKey, "authentication");

      // Send login request with the derived authHash
      console.log(`email : ${formData.email}`);
      console.log(`authHash : ${authHash}`);
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
      <p>
        Don&apos;t have an account?{" "}
        <span
          style={{ color: "#28a745" }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;

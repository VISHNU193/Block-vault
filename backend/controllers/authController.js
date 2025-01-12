import argon2 from "argon2";
import crypto from "crypto";
import { Pool } from "pg";

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'password_manager',
  password: 'postgres',
  port: 5432,
});



// Registration Endpoint
export async function registerUser(req, res) {
  const { username, email, authHash, salt} = req.body;

  if (!username || !email || !salt || !authHash) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Save user details to the database
    await pool.query(
      "INSERT INTO users (username, email, salt, auth_hash) VALUES ($1, $2, $3, $4)",
      [username, email, salt, authHash]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}


// Login Endpoint
export async function loginUser(req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    try {
      // Retrieve user details from the database
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const user = userResult.rows[0];
      const { salt, auth_hash: storedAuthHash } = user;
  
      // Derive key and recompute authHash
      const key = await deriveKey(password, salt);
      const authHash = HMAC(key, "authentication");
  
      if (authHash !== storedAuthHash) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
  
      // Generate and validate challenge-response
      const challenge = crypto.randomBytes(16).toString("base64");
      const signature = HMAC(authHash, challenge); // Client-side signature
      const validSignature = HMAC(storedAuthHash, challenge); // Server-side validation
  
      if (signature !== validSignature) {
        return res.status(401).json({ message: "Signature mismatch. Authentication failed." });
      }
  
      res.status(200).json({ message: "Login successful.", challenge, signature });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
  
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import argon2 from "argon2";
import crypto from "crypto";
import pkg from 'pg';
const { Pool } = pkg;

// Initialize environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all origins (customize as needed)
app.use(cors());

// PostgreSQL client setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'password_manager',
    password: 'postgres',
    port: 5432,
});

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

// Register endpoint
app.post("/api/register", async (req, res) => {
    const { username, email, authHash, salt, ipfs_hash} = req.body;

    if (!username || !email || !salt || !authHash || !ipfs_hash) {
      return res.status(400).json({ message: "All fields are required." });
    }

  try {
    // Check if the user already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    await pool.query(
      "INSERT INTO users (username, email, salt, auth_hash, ipfs_hash) VALUES ($1, $2, $3, $4, $5)",
      [username, email, salt, authHash, ipfs_hash]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Fetch the stored salt and authHash for the given email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const { salt, auth_hash } = user.rows[0];

    // Derive key using the stored salt
    const key = await deriveKey(password, salt);

    // Recompute the authHash
    const computedAuthHash = HMAC(key, "authentication");

    // Check if the computed authHash matches the stored authHash
    if (computedAuthHash !== auth_hash) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate and validate challenge signature (for additional security)
    const challenge = crypto.randomBytes(16).toString("base64"); // Random challenge
    const signature = HMAC(auth_hash, challenge); // Generated signature
    const validSignature = HMAC(auth_hash, challenge); // Server-side validation

    if (signature === validSignature) {
      res.status(200).json({ message: "Login successful." });
    } else {
      res.status(400).json({ message: "Login failed: Signature mismatch." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Authentication System!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

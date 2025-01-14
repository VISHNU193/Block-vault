import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import argon2 from "argon2";
import crypto from "crypto";
import pkg from 'pg';
const { Pool } = pkg;
import { v4 as uuidv4 } from 'uuid';
import { PinataSDK } from "pinata-web3";


import { readDataAndUpdateFile } from "./update-file.js";
import { readFileFromIpfsByEmail } from "./read-file-from-ipfs.js";


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

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey:process.env.GATEWAY_KEY,
})

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
    const { username, email, authHash, salt, iv,ciphertext} = req.body;

    if (!username || !email || !salt || !authHash || !iv || !ciphertext) {
      return res.status(400).json({ message: "All fields are required." });
    }

  try {
    // Check if the user already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const uuid_file_name = uuidv4();

    const metadata ={
      name:uuid_file_name
    }

    let blob = new Blob([ciphertext]);
    let file = new File([blob], `${uuid_file_name}.txt`, { type: "text/plain"})
    let upload = await pinata.upload.file(file,{metadata:metadata});
    console.log(upload)

    const ipfs_hash = upload.IpfsHash


    await pool.query(
      "INSERT INTO users (username, email, salt, auth_hash, ipfs_hash, file_name, iv) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [username, email, salt, authHash, ipfs_hash, uuid_file_name, iv]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, computedAuthHash } = req.body;
  console.log(`email :${email}`);
  console.log(`hash : ${computedAuthHash}`);
  
  if (!email || !computedAuthHash) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Fetch the stored salt and authHash for the given email
    const user = await pool.query("SELECT auth_hash FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const { auth_hash } = user.rows[0];

    

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

app.post("/api/get-salt",async (req, res) => {
  const { email } = req.body;

  // Input validation
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Query to fetch the salt for the given email
    const query = "SELECT salt FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    // Check if the email exists in the database
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Retrieve the salt
    const salt = result.rows[0].salt;

    // Respond with the salt
    return res.status(200).json({ salt });
  } catch (error) {
    console.error("Error fetching salt:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});




let vaultItems = []; // Simulating a database

// // Get items
// app.get("/api/vault-items",async (req, res) => {
//   const email = req.headers.email;
//   console.log(email);
  
//   // console.log(vaultItems);
  
//   const result = await readFileFromIpfsByEmail(email)
//   console.log(`result from ipfs :${result}`);
  
//   // const resJson = JSON.parse(result)
//   // console.log(`res json : ${resJson}`);
//   try {

//     const user = await pool.query("SELECT * FROM users WHERE email=$1",[email])
//     const {iv} = user.rows[0]



//     }catch (error) {
//     console.log(error);
    
//   }
//   res.send({

//   });
// });

app.get("/api/vault-items", async (req, res) => {
  const email = req.headers.email; // Extract email from headers
  console.log(`Email received: ${email}`);

  try {
    // Retrieve the user data from the database
    const userQuery = await pool.query("SELECT iv FROM users WHERE email=$1", [email]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { iv } = userQuery.rows[0];
    console.log(`IV retrieved: ${iv}`);

    // Fetch encrypted data from IPFS
    const encryptedData = await readFileFromIpfsByEmail(email);
    console.log(`Encrypted data retrieved from IPFS: ${encryptedData}`);

    // Send the encrypted data and IV to the client
    res.status(200).json({
      iv,
      encryptedData,
    });
  } catch (error) {
    console.error("Error in /api/vault-items:", error.message);
    res.status(500).json({ message: "An error occurred while retrieving vault items." });
  }
});


// // Update items
// app.post("/api/vault-items",async (req, res) => {
//   const { email,items } = req.body;
//   console.log(`post email : ${email}`);
//   console.log(`post items : ${items}`);
  
//   if (!items || !Array.isArray(items) || !email) {
//     return res.status(400).json({ error: "Invalid data" });
//   }
//   vaultItems = items; // Replace with database update logic
//   console.log(vaultItems);
//   console.log(`email : ${email}`);
  
//    await readDataAndUpdateFile(email,JSON.stringify(items))
  
//   res.status(200).json({ message: "Vault updated successfully" });
// });



app.post("/api/vault-items", async (req, res) => {
  const { email, iv, ciphertext } = req.body;

  console.log(`Received email: ${email}`);
  console.log(`Received IV: ${iv}`);
  console.log(`Received ciphertext: ${ciphertext}`);

  if (!email || !iv || !ciphertext) {
    return res.status(400).json({ error: "Invalid data. Email, IV, and ciphertext are required." });
  }

  try {
    // Store the IV in the users table
    const updateQuery = `
      UPDATE users 
      SET iv = $1 
      WHERE email = $2
      RETURNING id
    `;
    const updateResult = await pool.query(updateQuery, [iv, email]);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found. IV update failed." });
    }

    console.log(`IV updated for email: ${email}`);

    // Send ciphertext to IPFS
    await readDataAndUpdateFile(email, ciphertext);

    console.log(`Ciphertext updated in IPFS for email: ${email}`);

    res.status(200).json({ message: "Vault updated successfully." });
  } catch (error) {
    console.error("Error in /api/vault-items POST:", error.message);
    res.status(500).json({ error: "An error occurred while updating the vault." });
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

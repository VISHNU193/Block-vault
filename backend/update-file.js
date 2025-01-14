// const { PinataSDK } = require("pinata-web3")
// const fs = require("fs")
// require("dotenv").config()
// // import { PinataSDK } from "pinata-web3";
// const { v4: uuidv4 } = require('uuid');
// const {Pool} = require('pg');


import { PinataSDK } from "pinata-web3";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config()

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey:process.env.GATEWAY_KEY,
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'password_manager',
    password: 'postgres',
    port: 5432,
});




async function upload(filepath,newContent){
  try {
    let blob = new Blob([fs.readFileSync(filepath)]);
    let file = new File([blob], "6469bef1-fa45-427d-852a-39e2881ed4e7.txt", { type: "text/plain"})
    let upload = await pinata.upload.file(file);
    console.log(upload)

    // ipfs_hash = upload.IpfsHash

    // fs.writeFileSync(filepath,newContent,"utf-8");
    

    // const unpin = await pinata.unpin([ipfs_hash])
    // console.log(unpin);

    // blob = new Blob([fs.readFileSync(filepath)]);
    // file = new File([blob], "6469bef1-fa45-427d-852a-39e2881ed4e7.txt", { type: "text/plain"})
    // upload = await pinata.upload.file(file);
    // console.log(upload)
    
  } catch (error) {
    console.log(error)
  }
}

// console.log(process.env.PINATA_JWT);
// console.log(process.env.GATEWAY_URL);



// upload("/home/vishnu-kumar-k/all-code/cns/Block-vault/backend/src/6469bef1-fa45-427d-852a-39e2881ed4e7.txt","this is the new content in this uuid file")


// 6UTx0lL1-sOcKTgWtqks6M5dnZ3n6tB_qsNvlZM6bfbd35Ag8YRiBdeqLQt8Sqsb



// API Key: 
// API Secret: bcb3cf704de59a34c2def298e483e11fcf6c36cc1d05e49a2af49e95e8e5ef4d
// JWT: 



// console.log(uuidv4());


async function updateFile(cid, uuid_file_name, newContent) {
    try {
        
        const unpin = await pinata.unpin([cid])
        console.log(unpin);

        const metadata ={
            name:uuid_file_name
        }

        let blob = new Blob([newContent]);
        let file = new File([blob], `${uuid_file_name}.txt`, { type: "text/plain"})
        let upload = await pinata.upload.file(file,{metadata:metadata});
        console.log(upload)

        return await upload.IpfsHash;

    } catch (error) {
        console.log(error);
    }
}

export async function readDataAndUpdateFile(email,data) {
    


    try {
        
        const user = await pool.query("SELECT * FROM users WHERE email=$1",[email])
        const {file_name,ipfs_hash}=user.rows[0];
        
        const newIpfs_hash = await updateFile(ipfs_hash,file_name,data)
        const result = await pool.query(
            'UPDATE users SET ipfs_hash = $1 WHERE email = $2 RETURNING *',
            [newIpfs_hash, email]
          );
        // console.log(result);
        

    } catch (error) {
        console.log(error);
    }
}


let data =[{
    "url":"a",
    "username":"b",
    "password":"c"
}]

readDataAndUpdateFile("z@z.com","vxSEE4wZdnwySNAbjc4yGX7E61/ktjKj2z6dhS4DaoWuniJC9XU6Ip5eB1UwEfXLAyXUREQgJB5aR7tk6GHH/7TfpgTxA57xbPNCLCw55Q7ZGJRcfG5HCqF/WvlC7Lh6gcOUe0Y=")
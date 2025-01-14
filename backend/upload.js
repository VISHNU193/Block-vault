// const { PinataSDK } = require("pinata-web3")
// const fs = require("fs")
// require("dotenv").config()

// const { v4: uuidv4 } = require('uuid');

import { PinataSDK } from "pinata-web3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config()

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey:process.env.GATEWAY_KEY,
})

async function upload(filepath,newContent){
  try {
    let blob = new Blob([fs.readFileSync(filepath)]);
    let file = new File([blob], "e8147d97-7d8b-4851-8559-81b3f8ab581d.txt", { type: "text/plain"})
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

console.log(process.env.PINATA_JWT);
console.log(process.env.GATEWAY_URL);



upload("/home/vishnu-kumar-k/all-code/cns/Block-vault/backend/src/e8147d97-7d8b-4851-8559-81b3f8ab581d.txt","[]")


// 6UTx0lL1-sOcKTgWtqks6M5dnZ3n6tB_qsNvlZM6bfbd35Ag8YRiBdeqLQt8Sqsb



// API Key: 
// API Secret: bcb3cf704de59a34c2def298e483e11fcf6c36cc1d05e49a2af49e95e8e5ef4d
// JWT: 



// console.log(uuidv4());

// const { PinataSDK } = require("pinata-web3")
// const fs = require("fs")
// require("dotenv").config()
// const axios = require('axios');



import { PinataSDK } from "pinata-web3";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import pkg from 'pg';
const { Pool } = pkg;
import axios from "axios";


dotenv.config()

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey:process.env.GATEWAY_KEY,
})


// PostgreSQL client setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'password_manager',
    password: 'postgres',
    port: 5432,
});

async function readFileFromIpfs(cid) {
    const response = await axios.get(`https://orange-chemical-crane-445.mypinata.cloud/ipfs/${cid}?pinataGatewayToken=7B2qzCRHBCh2OhxUmW5J90bpOHjNDLsW73B6CbI0hLtgPDchdQ-6Sp6sXZ1W3uzB`)

    console.log(response.data);

    let v = response.data;
    console.log(v);
    
    

    return {response}
}

// readFileFromIpfs("bafkreib45ogojcspkreugrehtkpgelaxgi7sfjgmtc6vsm734kmukgernm")


export async function readFileFromIpfsByEmail(email){
    try {
        const user = await pool.query("Select ipfs_hash from users where email=$1",[email])
        let {ipfs_hash} = user.rows[0];
        console.log(user.fields);
        
        console.log(user.rowCount);
        
        console.log(`ipfs_hash : ${ipfs_hash}`);
        
        const response = await readFileFromIpfs(ipfs_hash)
        // const file = await pinata.gateways.get(ipfs_hash)

        const data = response.response.data
        console.log(`final data :${JSON.stringify(data)}`);
        

        return JSON.stringify(data)
        
    } catch (error) {
        console.log(`error in readfile ipfs`);
        
        console.log(error);
        
    }
}

readFileFromIpfsByEmail("z@z.com")
const { PinataSDK } = require("pinata-web3")
const fs = require("fs")
require("dotenv").config()

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey:process.env.GATEWAY_KEY,
})

async function upload(){
  try {
    const blob = new Blob([fs.readFileSync("./src/hello-world.txt")]);
    const file = new File([blob], "hello-world.txt", { type: "text/plain"})
    const upload = await pinata.upload.file(file);
    console.log(upload)
  } catch (error) {
    console.log(error)
  }
}

console.log(process.env.PINATA_JWT);
console.log(process.env.GATEWAY_URL);



upload()


// 6UTx0lL1-sOcKTgWtqks6M5dnZ3n6tB_qsNvlZM6bfbd35Ag8YRiBdeqLQt8Sqsb



// API Key: 
// API Secret: bcb3cf704de59a34c2def298e483e11fcf6c36cc1d05e49a2af49e95e8e5ef4d
// JWT: 
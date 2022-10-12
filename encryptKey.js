// this file encrypts PRIVATE KEY from .env after this action PRIVATE_KEY is removed from .env
// encrypted output goes .encryptedKey.json

const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  console.log(process.env.PRIVATE_KEY);
  console.log(process.env.PRIVATE_KEY_PASSWORD); // 'password' for example. After this we delete this env variable from .env
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  console.log(encryptedJsonKey);
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

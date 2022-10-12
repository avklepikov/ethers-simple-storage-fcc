//genache is used as a VM to test smart contract https://trufflesuite.com/ganache/ download and install
// use ethers or web3.js to interat with blockchains
// use dotenv to capture environmanet variable from .env: yarn add dotenv
// access variables with proces.env.XXXXX

const ethers = require("ethers"); // needed to interact with blockchains
const fs = require("fs-extra"); //we need to work with files

require("dotenv").config();

async function main() {
  // http://127.0.0.1:7545
  // explore playground.open-rpc.org to learn more about api calls
  // we will compile sol separatelly using solcJs
  // yarn solcjs --bin --include-path node_modules/ --base-path . SimpleStorage.sol

  const provider = new ethers.providers.JsonRpcProvider(
    //"http://127.0.0.1:7545" // moved to .env
    process.env.RPC_URL
  );

  // OPTION A ===============
  // commented after encryption.
  // const wallet = new ethers.Wallet(
  //   //"30360b24d44ec9116f6e1c7108fdf190a614efbaab71257ef0786e83dc85bac1", // Do not keep private key directly in the code !!!
  //   process.env.PRIVATE_KEY,
  //   provider
  // );

  // OPTION B ===============
  //Encrypting and creating new wallet from encrypted fey
  const encryptedJSON = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJSON,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = wallet.connect(provider);
  // ========================

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  // UNCOMMENT 4 Lines of code below for deploying with method 1 and comment manual deployment with tx below
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("Deploying .. please wait...");

  const contract = await contractFactory.deploy(); // STOP HERE TO DEPLOY
  // we can use await becouse deploy() returns a promise

  const deploymentReceipt = await contract.deployTransaction.wait(1); // wait for confirmation on how many blocks to be added to ensure that contract was added

  // console.log("Here is the deployment transaction:");
  // console.log(contract.deployTransaction);
  // console.log("Here is the transaction receipt:");
  // console.log(deploymentReceipt);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(currentFavoriteNumber); // output "BigNumber { _hex: '0x00', _isBigNumber: true }""
  console.log(currentFavoriteNumber.toString()); // outputs string format
  console.log(
    `This is my faforite number: ${currentFavoriteNumber.toString()}`
  );

  const transactionResponse = await contract.store("7"); // works with and without ""
  const transactionReceit = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated number: ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

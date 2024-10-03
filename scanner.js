require('dotenv').config();
const Web3 = require('web3');

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Uniswap factory contract address
const UNISWAP_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6'; // Uniswap V2 factory address
const UNISWAP_FACTORY_ABI = [
    // Only include the events we're interested in
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token0", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "token1", "type": "address" },
            { "indexed": false, "internalType": "address", "name": "pair", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "PairCreated",
        "type": "event"
    }
];

const uniswapFactory = new web3.eth.Contract(UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ADDRESS);

// Function to start listening for new pairs
async function startListening() {
    console.log('Listening for new Uniswap pairs...');

    uniswapFactory.events.PairCreated({
        filter: {},
        fromBlock: 'latest' // Start from the latest block
    })
    .on('data', async (event) => {
        const { token0, token1, pair } = event.returnValues;
        console.log(`New pair created: ${pair}`);
        console.log(`Token0: ${token0}`);
        console.log(`Token1: ${token1}`);

        // Optionally, you can add logic to interact with the token contracts
        await scanToken(pair);
    })
    .on('error', console.error);
}

// Function to scan token contract addresses
async function scanToken(tokenAddress) {
    try {
        const contract = new web3.eth.Contract([], tokenAddress);
        // Add logic to fetch token details, e.g., symbol, name, total supply, etc.
        console.log(`Scanning token at address: ${tokenAddress}`);
    } catch (error) {
        console.error(`Error scanning token: ${error}`);
    }
}

// Start the listener
startListening();

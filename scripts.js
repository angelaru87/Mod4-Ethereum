if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    console.log('MetaMask is not installed. Please install it to use this app.');
}

const contractAddress = '0x60dD7062209F7d3f567eF5D65CB032205FcFf5f8s';
const contractABI = [[{"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountAIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountBOut","type":"uint256"}],"name":"SwapAforB","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountBIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountAOut","type":"uint256"}],"name":"SwapBforA","type":"event"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserveA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reserveB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],"name":"swapAforB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],"name":"swapBforA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenA","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenB","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]];
const contract = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById('LiquidityOn').addEventListener('click', async function() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.addLiquidity().send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('Liquidity On executed', receipt);
        })
        .on('error', function(error) {
            console.error('Error executing Liquidity On', error);
        });
});

document.getElementById('LiquidityOff').addEventListener('click', async function() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.removeLiquidity().send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('Liquidity Off executed', receipt);
        })
        .on('error', function(error) {
            console.error('Error executing Liquidity Off', error);
        });
});

document.getElementById('TokAxB').addEventListener('click', async function() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.swapAforB().send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('TokAxB executed', receipt);
        })
        .on('error', function(error) {
            console.error('Error executing TokAxB', error);
        });
});

document.getElementById('TokBxA').addEventListener('click', async function() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.swapBforA().send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('TokBxA executed', receipt);
        })
        .on('error', function(error) {
            console.error('Error executing TokBxA', error);
        });
});

document.getElementById('GetPrice').addEventListener('click', async function() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.getPrice().send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('Get Price executed', receipt);
        })
        .on('error', function(error) {
            console.error('Error executing Get Price', error);
        });
});

document.getElementById('GetPriceButton').addEventListener('click', async function() {
    // Ejemplo de lógica para obtener los precios de Token A y Token B
    // Reemplazar estas funciones con las que corresponda para obtener los datos reales
    const tokenAPrice = await getTokenPrice('TokenA');
    const tokenBPrice = await getTokenPrice('TokenB');
    
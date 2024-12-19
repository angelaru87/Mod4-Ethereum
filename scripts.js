// Global variables
let provider;
let signer;
let simpleDex;
let tokenA;
let tokenB;
let selectedToken;


// Contracts Addresses
const tokenAAddress = '0x881B30a12B74d2E38d5ee2250BA89e92c415E18c';
const tokenBAddress = '0x8Dc4E60f5DB7281d958bEdaa4712F05Da910Db77';
const simpleDexAddress = '0x60dD7062209F7d3f567eF5D65CB032205FcFf5f8';

// Load ABIs from external path
async function loadABI(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Error al cargar ABI desde ${path}`);
    return await response.json();
}

// Providers & Contracts Initializer
async function initializeProvider() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await ethereum.request({ method: 'eth_requestAccounts' });

        const [simpleDexABI, tokenAABI, tokenBABI] = await Promise.all([
            loadABI('./Abi/SimpleDex.json'),
            loadABI('./Abi/TokenA.json'),
            loadABI('./Abi/TokenB.json')
        ]);

        // Contracts signers
        simpleDex = new ethers.Contract(simpleDexAddress, simpleDexABI, signer);
        tokenA = new ethers.Contract(tokenAAddress, tokenAABI, signer);
        tokenB = new ethers.Contract(tokenBAddress, tokenBABI, signer);

        // Update wallet
        updateWalletInfo();
    } else {
        alert('Por favor, instala Metamask!');
    }
}
// Update Gas Info
async function updateGasInfo() {
    try {

        document.getElementById('gas-amount').textContent = `${ethers.utils.formatUnits(gasPrice, "gwei")} Gwei`;
    } catch (error) {
        console.error("Error al obtener el precio del gas:", error);
        document.getElementById('gas-amount').textContent = "No disponible";
    }
}
// Update Wallet Info
async function updateWalletInfo() {
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();
    const gasPrice = await provider.getGasPrice();

    // Update
    document.getElementById('wallet-address').textContent = address;
    document.getElementById('eth-balance').textContent = ethers.utils.formatEther(balance);
    document.getElementById('network-name').textContent = network.name;
    document.getElementById('gas-amount').textContent = `${ethers.utils.formatUnits(gasPrice, "gwei")} Gwei`;

    // Show Functions
    document.getElementById('wallet-info').classList.remove('hidden');
    document.getElementById('btn-connect').classList.add('hidden');

}


// Function To get Token Price
async function getTokenPrice() {
    const tokenToGetPrice = document.getElementById('tokenPrice').value; // Obtener el valor seleccionado
    let tokenAddress;

    // Get the token price by address 
    if (tokenToGetPrice === 'tokenA') {
        tokenAddress = tokenAAddress;
    } else if (tokenToGetPrice === 'tokenB') {
        tokenAddress = tokenBAddress;
    } else {
        alert('Token no válido');
        return;
    }

    try {
        // Call Function `getPrice` 
        const price = await simpleDex.getPrice(tokenAddress);

        // Verifier
        if (price && price.gt(0)) {
            document.getElementById('priceResult').textContent = `Precio: ${ethers.utils.parseUnits(price.toString(), 18)}`;
        } else {
            document.getElementById('priceResult').textContent = "Precio no disponible";
        }
    } catch (error) {
        console.error('Error al obtener precio:', error);
        alert('Error al obtener precio');
    }
}

// Swap Function
async function swapTokens() {
    const tokenToSwap = document.getElementById('tokenToSwap').value;
    const swapAmount = document.getElementById('swapAmount').value;

    if (swapAmount <= 0) {
        alert('Por favor ingresa una cantidad válida');
        return;
    }

    const amountIn = ethers.utils.parseUnits(swapAmount, 18);

    try {
        let tx;
        if (tokenToSwap === 'tokenA') {
            // Approve
            await tokenA.approve(simpleDexAddress, amountIn);
            tx = await simpleDex.swapAforB(amountIn);
        } else {
            // AApprove
            await tokenB.approve(simpleDexAddress, amountIn);
            tx = await simpleDex.swapBforA(amountIn);
        }
        await tx.wait();
        alert('Intercambio exitoso');
    } catch (error) {
        console.error('Error al intercambiar tokens:', error);
        alert('Error al intercambiar tokens');
    }
}


// Liquidity Function On
async function addLiquidity() {
    const tokenAAmount = document.getElementById('addLiquidityTokenA').value;
    const tokenBAmount = document.getElementById('addLiquidityTokenB').value;

    if (tokenAAmount <= 0 || tokenBAmount <= 0) {
        alert('Por favor ingresa cantidades válidas');
        return;
    }

    try {
        // Approve
        await tokenA.approve(simpleDexAddress, ethers.utils.parseUnits(tokenAAmount, 18));
        await tokenB.approve(simpleDexAddress, ethers.utils.parseUnits(tokenBAmount, 18));

        // Call Function
        const tx = await simpleDex.addLiquidity(
            ethers.utils.parseUnits(tokenAAmount, 18),
            ethers.utils.parseUnits(tokenBAmount, 18)
        );
        await tx.wait();
        alert('Liquidez agregada exitosamente');
    } catch (error) {
        console.error('Error al agregar liquidez:', error);
        alert('Error al agregar liquidez');
    }
}

// Liquidity Function Off
async function removeLiquidity() {
    const tokenAAmount = document.getElementById('removeLiquidityTokenA').value;
    const tokenBAmount = document.getElementById('removeLiquidityTokenB').value;

    if (tokenAAmount <= 0 || tokenBAmount <= 0) {
        alert('Por favor ingresa cantidades válidas');
        return;
    }

    try {
        // Call Function
        const tx = await simpleDex.removeLiquidity(
            ethers.utils.parseUnits(tokenAAmount, 18),
            ethers.utils.parseUnits(tokenBAmount, 18)
        );
        await tx.wait();
        alert('Liquidez retirada exitosamente');
    } catch (error) {
        console.error('Error al retirar liquidez:', error);
        alert('Error al retirar liquidez');
    }
}

document.getElementById('btn-getPrice').addEventListener('click', getTokenPrice);


document.getElementById('btn-connect').addEventListener('click', () => {
    initializeProvider();
});


// Contract interaction features
document.getElementById('btn-addLiquidity').addEventListener('click', addLiquidity);
document.getElementById('btn-removeLiquidity').addEventListener('click', removeLiquidity);
document.getElementById('btn-swap').addEventListener('click', swapTokens);
document.getElementById('btn-getPrice').addEventListener('click', getTokenPrice);


// const contractABI = [[{"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountAIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountBOut","type":"uint256"}],"name":"SwapAforB","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountBIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountAOut","type":"uint256"}],"name":"SwapBforA","type":"event"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserveA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reserveB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],"name":"swapAforB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],"name":"swapBforA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenA","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenB","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]];

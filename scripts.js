if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    console.log('MetaMask is not installed. Please install it to use this app.');
}

const contractAddress = '0xYourContractAddress';
const contractABI = [/* ABI del contrato */];
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

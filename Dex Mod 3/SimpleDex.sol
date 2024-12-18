// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

    /** @notice OpenZeppelin interfaces Import to use: 
    * standart ERC20 and Owner access control */
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    /** @title SimpleDEX 
    * @dev A simple decentralized exchange for TokenA and TokenB 
    * using constant product formula. */
        contract SimpleDEX is Ownable {
        IERC20 public tokenA; 
        IERC20 public tokenB; 
        uint256 public reserveA; 
        uint256 public reserveB; 
    /// @notice Emitted when liquidity is added to the pool.
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    /// @notice Emitted when liquidity is removed from the pool.
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    /// @notice Emitted when TokenA is swapped for TokenB.
    event SwapAforB(address indexed trader, uint256 amountAIn, uint256 amountBOut);
    /// @notice Emitted when TokenB is swapped for TokenA.
    event SwapBforA(address indexed trader, uint256 amountBIn, uint256 amountAOut);

    /** * @notice Constructor initializes the contract with the addresses of TokenA and TokenB. 
    * @param _tokenA The address of TokenA. 
    * @param _tokenB The address of TokenB. */
      constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        tokenA = IERC20(_tokenA); 
        tokenB = IERC20(_tokenB); 

    }

    /** * @notice Adds liquidity to the pool. 
    * @param amountA The amount of TokenA to add. 
    * @param amountB The amount of TokenB to add. */
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer of TokenA failed");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "Transfer of TokenB failed");

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    /** * @notice Swaps a given amount of TokenA for TokenB. 
    * @param amountAIn The amount of TokenA to swap. */
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount must be greater than zero");
        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);
        require(amountBOut > 0, "Insufficient output amount");

        require(tokenA.transferFrom(msg.sender, address(this), amountAIn), "Transfer of TokenA failed");
        require(tokenB.transfer(msg.sender, amountBOut), "Transfer of TokenB failed");

        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit SwapAforB(msg.sender, amountAIn, amountBOut);
    }

    /** * @notice Swaps a given amount of TokenB for TokenA. 
    * @param amountBIn The amount of TokenB to swap. */
    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount must be greater than zero");
        uint256 amountAOut = getAmountOut(amountBIn, reserveB, reserveA);
        require(amountAOut > 0, "Insufficient output amount");

        require(tokenB.transferFrom(msg.sender, address(this), amountBIn), "Transfer of TokenB failed");
        require(tokenA.transfer(msg.sender, amountAOut), "Transfer of TokenA failed");

        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit SwapBforA(msg.sender, amountBIn, amountAOut);
    }

    /** * @notice Removes liquidity from the pool. 
    * @param amountA The amount of TokenA to remove. 
    * @param amountB The amount of TokenB to remove. */
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA <= reserveA && amountB <= reserveB, "Insufficient liquidity");

        reserveA -= amountA;
        reserveB -= amountB;

        require(tokenA.transfer(msg.sender, amountA), "Transfer of TokenA failed");
        require(tokenB.transfer(msg.sender, amountB), "Transfer of TokenB failed");

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    /** * @notice Gets the price of a given token in terms of the other token in the pool. 
    * @param _token The address of the token to get the price of. 
    * @return The price of the token. */
    function getPrice(address _token) external view returns (uint256) {
        if (_token == address(tokenA)) {
            return reserveB / reserveA;
        } else if (_token == address(tokenB)) {
            return reserveA / reserveB;
        } else {
            revert("Invalid token address");
        }
    }

    /** * @notice Calculates the output amount of tokens given an input amount and reserves. 
    * @param amountIn The input amount of tokens. 
    * @param reserveIn The reserve of the input token. 
    * @param reserveOut The reserve of the output token. 
    * @return The output amount of tokens. */
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) private pure returns (uint256) {
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }
}

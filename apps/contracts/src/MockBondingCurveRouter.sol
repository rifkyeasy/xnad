// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MockToken} from "./MockToken.sol";

/// @title MockBondingCurveRouter
/// @notice Simulates realistic meme coin bonding curve trading with volatility
/// @dev Uses x*y=k AMM formula with virtual reserves for price discovery
contract MockBondingCurveRouter {
    // Fee: 1%
    uint256 public constant FEE_BPS = 100;

    // Pool state per token
    struct Pool {
        uint256 reserveMon;      // Virtual MON reserve
        uint256 reserveToken;    // Virtual token reserve
        uint256 k;               // Constant product k = x * y
        uint256 totalVolume;     // Total trading volume
        uint256 lastTradeTime;   // For volatility simulation
        int256 momentum;         // Price momentum (-100 to +100)
        bool initialized;
    }

    mapping(address => Pool) public pools;

    // Random seed for volatility
    uint256 private nonce;

    event PoolInitialized(address indexed token, uint256 reserveMon, uint256 reserveToken);
    event Trade(
        address indexed token,
        address indexed trader,
        bool isBuy,
        uint256 amountIn,
        uint256 amountOut
    );

    /// @notice Initialize a pool for a token (or auto-init on first trade)
    /// @param token The token address
    /// @param initialReserveMon Initial MON reserve (determines starting price)
    /// @param initialReserveToken Initial token reserve
    function initializePool(
        address token,
        uint256 initialReserveMon,
        uint256 initialReserveToken
    ) external {
        require(!pools[token].initialized, "Pool exists");
        require(initialReserveMon > 0 && initialReserveToken > 0, "Zero reserves");

        pools[token] = Pool({
            reserveMon: initialReserveMon,
            reserveToken: initialReserveToken,
            k: initialReserveMon * initialReserveToken,
            totalVolume: 0,
            lastTradeTime: block.timestamp,
            momentum: 0,
            initialized: true
        });

        emit PoolInitialized(token, initialReserveMon, initialReserveToken);
    }

    /// @notice Auto-initialize pool with default meme coin parameters
    function _autoInitPool(address token) internal {
        if (!pools[token].initialized) {
            // Start with low liquidity = high volatility (meme coin style)
            // Initial price: ~0.000001 MON per token (1 MON = 1M tokens)
            uint256 initialMon = 10 ether;        // 10 MON virtual reserve
            uint256 initialTokens = 10_000_000 ether; // 10M tokens virtual reserve

            pools[token] = Pool({
                reserveMon: initialMon,
                reserveToken: initialTokens,
                k: initialMon * initialTokens,
                totalVolume: 0,
                lastTradeTime: block.timestamp,
                momentum: int256(_pseudoRandom(50)), // Random starting momentum
                initialized: true
            });

            emit PoolInitialized(token, initialMon, initialTokens);
        }
    }

    /// @notice Buy tokens with MON - price increases after buy
    function buy(
        address token,
        uint256 amountOutMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountOut) {
        require(block.timestamp <= deadline, "Deadline expired");
        require(msg.value > 0, "Zero value");

        _autoInitPool(token);
        Pool storage pool = pools[token];

        // Apply fee
        uint256 fee = (msg.value * FEE_BPS) / 10000;
        uint256 amountInAfterFee = msg.value - fee;

        // Add volatility factor based on momentum and time
        uint256 volatilityBonus = _calculateVolatilityBonus(pool, true);

        // Calculate output using x*y=k with volatility adjustment
        // newReserveMon = reserveMon + amountIn
        // newReserveToken = k / newReserveMon
        // amountOut = reserveToken - newReserveToken
        uint256 newReserveMon = pool.reserveMon + amountInAfterFee;
        uint256 newReserveToken = pool.k / newReserveMon;
        amountOut = pool.reserveToken - newReserveToken;

        // Apply volatility bonus (can increase output on momentum)
        amountOut = (amountOut * (10000 + volatilityBonus)) / 10000;

        require(amountOut >= amountOutMin, "Slippage exceeded");
        require(amountOut > 0, "Zero output");

        // Update pool state
        pool.reserveMon = newReserveMon;
        pool.reserveToken = pool.reserveToken - amountOut;
        pool.k = pool.reserveMon * pool.reserveToken;
        pool.totalVolume += msg.value;
        pool.lastTradeTime = block.timestamp;
        pool.momentum = _clampMomentum(pool.momentum + int256(amountInAfterFee / 1e16));

        // Mint tokens to buyer
        MockToken(token).faucet(to, amountOut / 1e18);

        emit Trade(token, to, true, msg.value, amountOut);
        return amountOut;
    }

    /// @notice Sell tokens for MON - price decreases after sell
    function sell(
        address token,
        uint256 amountIn,
        uint256 amountOutMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut) {
        require(block.timestamp <= deadline, "Deadline expired");
        require(amountIn > 0, "Zero amount");

        _autoInitPool(token);
        Pool storage pool = pools[token];

        // Transfer tokens from seller
        require(
            MockToken(token).transferFrom(msg.sender, address(this), amountIn),
            "Transfer failed"
        );

        // Add volatility factor (sells during negative momentum = worse price)
        uint256 volatilityPenalty = _calculateVolatilityBonus(pool, false);

        // Calculate output using x*y=k
        // newReserveToken = reserveToken + amountIn
        // newReserveMon = k / newReserveToken
        // amountOut = reserveMon - newReserveMon
        uint256 newReserveToken = pool.reserveToken + amountIn;
        uint256 newReserveMon = pool.k / newReserveToken;
        uint256 grossAmountOut = pool.reserveMon - newReserveMon;

        // Apply fee
        uint256 fee = (grossAmountOut * FEE_BPS) / 10000;
        amountOut = grossAmountOut - fee;

        // Apply volatility penalty (can decrease output on negative momentum)
        amountOut = (amountOut * (10000 - volatilityPenalty)) / 10000;

        require(amountOut >= amountOutMin, "Slippage exceeded");
        require(address(this).balance >= amountOut, "Insufficient liquidity");

        // Update pool state
        pool.reserveToken = newReserveToken;
        pool.reserveMon = pool.reserveMon - grossAmountOut;
        pool.k = pool.reserveMon * pool.reserveToken;
        pool.totalVolume += grossAmountOut;
        pool.lastTradeTime = block.timestamp;
        pool.momentum = _clampMomentum(pool.momentum - int256(amountIn / 1e16));

        // Send MON to seller
        (bool success, ) = to.call{value: amountOut}("");
        require(success, "Transfer failed");

        emit Trade(token, msg.sender, false, amountIn, amountOut);
        return amountOut;
    }

    /// @notice Get quote for buy/sell
    function getAmountOutWithFee(
        address token,
        uint256 amountIn,
        bool isBuy
    ) external view returns (uint256 amountOut, uint256 fee) {
        Pool storage pool = pools[token];

        if (!pool.initialized) {
            // Return estimate based on default pool params
            if (isBuy) {
                fee = (amountIn * FEE_BPS) / 10000;
                // Rough estimate: 1 MON = 1M tokens initially
                amountOut = (amountIn - fee) * 1_000_000;
            } else {
                // Rough estimate
                uint256 grossOut = amountIn / 1_000_000;
                fee = (grossOut * FEE_BPS) / 10000;
                amountOut = grossOut - fee;
            }
            return (amountOut, fee);
        }

        if (isBuy) {
            fee = (amountIn * FEE_BPS) / 10000;
            uint256 amountInAfterFee = amountIn - fee;
            uint256 newReserveMon = pool.reserveMon + amountInAfterFee;
            uint256 newReserveToken = pool.k / newReserveMon;
            amountOut = pool.reserveToken - newReserveToken;
        } else {
            uint256 newReserveToken = pool.reserveToken + amountIn;
            uint256 newReserveMon = pool.k / newReserveToken;
            uint256 grossOut = pool.reserveMon - newReserveMon;
            fee = (grossOut * FEE_BPS) / 10000;
            amountOut = grossOut - fee;
        }
    }

    /// @notice Get current token price in MON (18 decimals)
    function getPrice(address token) external view returns (uint256) {
        Pool storage pool = pools[token];
        if (!pool.initialized) {
            return 1e12; // Default: 0.000001 MON per token
        }
        return (pool.reserveMon * 1e18) / pool.reserveToken;
    }

    /// @notice Get pool info
    function getPoolInfo(address token) external view returns (
        uint256 reserveMon,
        uint256 reserveToken,
        uint256 price,
        uint256 totalVolume,
        int256 momentum
    ) {
        Pool storage pool = pools[token];
        if (!pool.initialized) {
            return (0, 0, 0, 0, 0);
        }
        return (
            pool.reserveMon,
            pool.reserveToken,
            (pool.reserveMon * 1e18) / pool.reserveToken,
            pool.totalVolume,
            pool.momentum
        );
    }

    /// @notice Calculate volatility bonus/penalty based on momentum and time
    function _calculateVolatilityBonus(Pool storage pool, bool isBuy) internal view returns (uint256) {
        // Time decay: momentum matters less over time
        uint256 timeSinceLastTrade = block.timestamp - pool.lastTradeTime;
        uint256 decayFactor = timeSinceLastTrade > 3600 ? 0 : (3600 - timeSinceLastTrade) * 100 / 3600;

        // Momentum effect (max 5% bonus/penalty)
        int256 momentumEffect = (pool.momentum * int256(decayFactor)) / 100;

        if (isBuy && momentumEffect > 0) {
            // Positive momentum = bonus tokens on buy (FOMO effect)
            return uint256(momentumEffect) * 5 / 100; // Max 5%
        } else if (!isBuy && momentumEffect < 0) {
            // Negative momentum = penalty on sell (panic effect)
            return uint256(-momentumEffect) * 5 / 100; // Max 5%
        }

        return 0;
    }

    /// @notice Clamp momentum between -100 and +100
    function _clampMomentum(int256 m) internal pure returns (int256) {
        if (m > 100) return 100;
        if (m < -100) return -100;
        return m;
    }

    /// @notice Pseudo-random number for volatility (not secure, just for simulation)
    function _pseudoRandom(uint256 max) internal returns (uint256) {
        nonce++;
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % max;
    }

    /// @notice Add liquidity (for sells to work)
    function addLiquidity() external payable {}

    /// @notice Withdraw liquidity
    function withdrawLiquidity(uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed");
    }

    receive() external payable {}
}

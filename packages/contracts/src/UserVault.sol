// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IUserVault} from "./interfaces/IUserVault.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IBondingCurveRouter {
    function buy(
        address token,
        uint256 amountOutMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountOut);

    function sell(
        address token,
        uint256 amountIn,
        uint256 amountOutMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut);
}

/// @title UserVault
/// @notice Personal vault for users to deposit MON and have agent trade on their behalf
/// @dev Implements IUserVault interface for agent-managed trading
contract UserVault is IUserVault {
    address public override owner;
    address public override agent;
    bool public override paused;

    // Strategy configuration
    uint8 public override strategyType; // 0=Conservative, 1=Balanced, 2=Aggressive
    uint256 public override maxTradeAmount;

    // Trade tracking
    uint256 public tradeNonce;

    modifier onlyOwner() {
        require(msg.sender == owner, "UserVault: not owner");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "UserVault: not agent");
        _;
    }

    modifier notPaused() {
        require(!paused, "UserVault: paused");
        _;
    }

    constructor(address _owner, address _agent) {
        require(_owner != address(0), "UserVault: zero owner");
        owner = _owner;
        agent = _agent;
        strategyType = 1; // Default: Balanced
        maxTradeAmount = 0.05 ether; // Default: 0.05 MON
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    // ============ View Functions ============

    function getBalance() external view override returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address token) external view override returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // ============ Owner Functions ============

    function deposit() external payable override {
        require(msg.value > 0, "UserVault: zero deposit");
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external override onlyOwner {
        require(amount <= address(this).balance, "UserVault: insufficient balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "UserVault: transfer failed");
        emit Withdrawn(owner, amount);
    }

    function withdrawAll() external override onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "UserVault: no balance");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "UserVault: transfer failed");
        emit Withdrawn(owner, balance);
    }

    function withdrawToken(address token, uint256 amount) external override onlyOwner {
        require(IERC20(token).transfer(owner, amount), "UserVault: token transfer failed");
    }

    function setAgent(address _agent) external override onlyOwner {
        address oldAgent = agent;
        agent = _agent;
        emit AgentUpdated(oldAgent, _agent);
    }

    function setStrategy(uint8 _type, uint256 _maxAmount) external override onlyOwner {
        require(_type <= 2, "UserVault: invalid strategy type");
        strategyType = _type;
        maxTradeAmount = _maxAmount;
        emit StrategyUpdated(_type, _maxAmount);
    }

    function setPaused(bool _paused) external override onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    // ============ Agent Functions ============

    /// @notice Execute a buy order on the bonding curve
    /// @param router The bonding curve router address
    /// @param token The token to buy
    /// @param amountIn Amount of MON to spend
    /// @param minAmountOut Minimum tokens to receive (slippage protection)
    /// @param deadline Transaction deadline
    function executeBuy(
        address router,
        address token,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external override onlyAgent notPaused returns (uint256 amountOut) {
        require(amountIn <= maxTradeAmount, "UserVault: exceeds max trade");
        require(amountIn <= address(this).balance, "UserVault: insufficient balance");
        require(block.timestamp <= deadline, "UserVault: deadline expired");

        // Execute buy on bonding curve
        amountOut = IBondingCurveRouter(router).buy{value: amountIn}(
            token,
            minAmountOut,
            address(this), // Tokens come to vault
            deadline
        );

        bytes32 txId = keccak256(abi.encodePacked(block.timestamp, tradeNonce++));
        emit TradeExecuted(token, true, amountIn, amountOut, txId);

        return amountOut;
    }

    /// @notice Execute a sell order on the bonding curve
    /// @param router The bonding curve router address
    /// @param token The token to sell
    /// @param tokenAmount Amount of tokens to sell
    /// @param minAmountOut Minimum MON to receive (slippage protection)
    /// @param deadline Transaction deadline
    function executeSell(
        address router,
        address token,
        uint256 tokenAmount,
        uint256 minAmountOut,
        uint256 deadline
    ) external override onlyAgent notPaused returns (uint256 amountOut) {
        require(block.timestamp <= deadline, "UserVault: deadline expired");

        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        require(tokenAmount <= tokenBalance, "UserVault: insufficient tokens");

        // Approve router to spend tokens
        IERC20(token).approve(router, tokenAmount);

        // Execute sell on bonding curve
        amountOut = IBondingCurveRouter(router).sell(
            token,
            tokenAmount,
            minAmountOut,
            address(this), // MON comes to vault
            deadline
        );

        bytes32 txId = keccak256(abi.encodePacked(block.timestamp, tradeNonce++));
        emit TradeExecuted(token, false, tokenAmount, amountOut, txId);

        return amountOut;
    }
}

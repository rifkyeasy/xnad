// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserVault {
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);
    event StrategyUpdated(uint8 strategyType, uint256 maxTradeAmount);
    event TradeExecuted(
        address indexed token,
        bool isBuy,
        uint256 amountIn,
        uint256 amountOut,
        bytes32 txId
    );
    event Paused(bool isPaused);

    // View functions
    function owner() external view returns (address);
    function agent() external view returns (address);
    function paused() external view returns (bool);
    function strategyType() external view returns (uint8);
    function maxTradeAmount() external view returns (uint256);
    function getBalance() external view returns (uint256);
    function getTokenBalance(address token) external view returns (uint256);

    // Owner functions
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function withdrawAll() external;
    function withdrawToken(address token, uint256 amount) external;
    function setAgent(address _agent) external;
    function setStrategy(uint8 _type, uint256 _maxAmount) external;
    function setPaused(bool _paused) external;

    // Agent functions
    function executeBuy(
        address router,
        address token,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external returns (uint256 amountOut);

    function executeSell(
        address router,
        address token,
        uint256 tokenAmount,
        uint256 minAmountOut,
        uint256 deadline
    ) external returns (uint256 amountOut);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {UserVault} from "../src/UserVault.sol";
import {VaultFactory} from "../src/VaultFactory.sol";

contract MockERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract MockRouter {
    MockERC20 public token;

    constructor(address _token) {
        token = MockERC20(_token);
    }

    function buy(
        address, // token
        uint256, // amountOutMin
        address to,
        uint256 // deadline
    ) external payable returns (uint256 amountOut) {
        // Mock: give 1000 tokens per 0.01 MON
        amountOut = msg.value * 100000;
        token.mint(to, amountOut);
        return amountOut;
    }

    function sell(
        address, // token
        uint256 amountIn,
        uint256, // amountOutMin
        address to,
        uint256 // deadline
    ) external returns (uint256 amountOut) {
        // Mock: give 0.01 MON per 1000 tokens
        amountOut = amountIn / 100000;
        token.transferFrom(msg.sender, address(this), amountIn);
        (bool success, ) = to.call{value: amountOut}("");
        require(success, "transfer failed");
        return amountOut;
    }

    receive() external payable {}
}

contract UserVaultTest is Test {
    UserVault public vault;
    VaultFactory public factory;
    MockERC20 public token;
    MockRouter public router;

    address public owner = address(0x1);
    address public agent = address(0x2);
    address public attacker = address(0x3);

    function setUp() public {
        // Deploy mock contracts
        token = new MockERC20();
        router = new MockRouter(address(token));

        // Fund router for sells
        vm.deal(address(router), 100 ether);

        // Deploy factory
        factory = new VaultFactory(agent);

        // Create vault for owner
        vm.prank(owner);
        address vaultAddr = factory.createVault();
        vault = UserVault(payable(vaultAddr));

        // Fund owner
        vm.deal(owner, 10 ether);
    }

    // ============ Factory Tests ============

    function test_FactoryCreatesVault() public view {
        assertEq(factory.getVault(owner), address(vault));
        assertTrue(factory.hasVault(owner));
        assertEq(factory.totalVaults(), 1);
    }

    function test_FactoryPreventsDoubleVault() public {
        vm.prank(owner);
        vm.expectRevert("VaultFactory: vault exists");
        factory.createVault();
    }

    function test_FactoryUpdatesDefaultAgent() public {
        address newAgent = address(0x99);
        factory.setDefaultAgent(newAgent);
        assertEq(factory.defaultAgent(), newAgent);
    }

    // ============ Vault Initialization Tests ============

    function test_VaultInitialization() public view {
        assertEq(vault.owner(), owner);
        assertEq(vault.agent(), agent);
        assertEq(vault.strategyType(), 1); // Balanced
        assertEq(vault.maxTradeAmount(), 0.05 ether);
        assertFalse(vault.paused());
    }

    // ============ Deposit Tests ============

    function test_Deposit() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();
        assertEq(vault.getBalance(), 1 ether);
    }

    function test_DepositViaReceive() public {
        vm.prank(owner);
        (bool success, ) = address(vault).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(vault.getBalance(), 1 ether);
    }

    function test_DepositZeroReverts() public {
        vm.prank(owner);
        vm.expectRevert("UserVault: zero deposit");
        vault.deposit{value: 0}();
    }

    // ============ Withdraw Tests ============

    function test_Withdraw() public {
        vm.startPrank(owner);
        vault.deposit{value: 1 ether}();

        uint256 balanceBefore = owner.balance;
        vault.withdraw(0.5 ether);
        uint256 balanceAfter = owner.balance;

        assertEq(vault.getBalance(), 0.5 ether);
        assertEq(balanceAfter - balanceBefore, 0.5 ether);
        vm.stopPrank();
    }

    function test_WithdrawAll() public {
        vm.startPrank(owner);
        vault.deposit{value: 1 ether}();
        vault.withdrawAll();
        assertEq(vault.getBalance(), 0);
        vm.stopPrank();
    }

    function test_WithdrawOnlyOwner() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(attacker);
        vm.expectRevert("UserVault: not owner");
        vault.withdraw(0.5 ether);
    }

    // ============ Strategy Tests ============

    function test_SetStrategy() public {
        vm.prank(owner);
        vault.setStrategy(2, 0.1 ether); // Aggressive

        assertEq(vault.strategyType(), 2);
        assertEq(vault.maxTradeAmount(), 0.1 ether);
    }

    function test_SetStrategyInvalidType() public {
        vm.prank(owner);
        vm.expectRevert("UserVault: invalid strategy type");
        vault.setStrategy(3, 0.1 ether);
    }

    function test_SetStrategyOnlyOwner() public {
        vm.prank(attacker);
        vm.expectRevert("UserVault: not owner");
        vault.setStrategy(0, 0.01 ether);
    }

    // ============ Agent Tests ============

    function test_SetAgent() public {
        address newAgent = address(0x88);
        vm.prank(owner);
        vault.setAgent(newAgent);
        assertEq(vault.agent(), newAgent);
    }

    function test_SetAgentOnlyOwner() public {
        vm.prank(attacker);
        vm.expectRevert("UserVault: not owner");
        vault.setAgent(attacker);
    }

    // ============ Pause Tests ============

    function test_Pause() public {
        vm.prank(owner);
        vault.setPaused(true);
        assertTrue(vault.paused());
    }

    function test_PauseBlocksTrades() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(owner);
        vault.setPaused(true);

        vm.prank(agent);
        vm.expectRevert("UserVault: paused");
        vault.executeBuy(
            address(router),
            address(token),
            0.01 ether,
            0,
            block.timestamp + 1 hours
        );
    }

    // ============ Trade Tests ============

    function test_ExecuteBuy() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(agent);
        uint256 amountOut = vault.executeBuy(
            address(router),
            address(token),
            0.01 ether,
            0,
            block.timestamp + 1 hours
        );

        // Should receive tokens
        assertGt(amountOut, 0);
        assertEq(vault.getTokenBalance(address(token)), amountOut);
        assertEq(vault.getBalance(), 0.99 ether);
    }

    function test_ExecuteBuyExceedsMax() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(agent);
        vm.expectRevert("UserVault: exceeds max trade");
        vault.executeBuy(
            address(router),
            address(token),
            0.1 ether, // Default max is 0.05
            0,
            block.timestamp + 1 hours
        );
    }

    function test_ExecuteBuyOnlyAgent() public {
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(attacker);
        vm.expectRevert("UserVault: not agent");
        vault.executeBuy(
            address(router),
            address(token),
            0.01 ether,
            0,
            block.timestamp + 1 hours
        );
    }

    function test_ExecuteSell() public {
        // First buy some tokens
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(agent);
        vault.executeBuy(
            address(router),
            address(token),
            0.01 ether,
            0,
            block.timestamp + 1 hours
        );

        uint256 tokenBalance = vault.getTokenBalance(address(token));
        uint256 monBalanceBefore = vault.getBalance();

        // Now sell
        vm.prank(agent);
        uint256 amountOut = vault.executeSell(
            address(router),
            address(token),
            tokenBalance,
            0,
            block.timestamp + 1 hours
        );

        assertGt(amountOut, 0);
        assertEq(vault.getTokenBalance(address(token)), 0);
        assertGt(vault.getBalance(), monBalanceBefore);
    }

    function test_ExecuteSellOnlyAgent() public {
        vm.prank(attacker);
        vm.expectRevert("UserVault: not agent");
        vault.executeSell(
            address(router),
            address(token),
            1000,
            0,
            block.timestamp + 1 hours
        );
    }

    // ============ Token Withdraw Tests ============

    function test_WithdrawToken() public {
        // Buy some tokens first
        vm.prank(owner);
        vault.deposit{value: 1 ether}();

        vm.prank(agent);
        vault.executeBuy(
            address(router),
            address(token),
            0.01 ether,
            0,
            block.timestamp + 1 hours
        );

        uint256 tokenBalance = vault.getTokenBalance(address(token));

        vm.prank(owner);
        vault.withdrawToken(address(token), tokenBalance);

        assertEq(vault.getTokenBalance(address(token)), 0);
        assertEq(token.balanceOf(owner), tokenBalance);
    }
}

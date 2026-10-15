// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * 1win Token ($1WIN) — Presale contract (TRON / TVM)
 * ----------------------------------------------------------------------------
 * HOW IT WORKS
 *  - Buyers contribute TRX (plain transfer or buyWithTrx()) or a whitelisted
 *    TRC-20 stablecoin via buyWithToken(token, amount) after an exact-amount
 *    `approve` to this contract.
 *  - Contributions are priced in USD (6 decimals) against owner-set stage
 *    terms (price + bonus). The contract only RECORDS entitlements — it does
 *    not mint anything.
 *  - At TGE the owner deposits $1WIN and calls enableClaim(); buyers then
 *    withdraw their own allocation with claim(). Nothing moves silently.
 *
 * SAFETY NOTES
 *  - Checks-effects-interactions + nonReentrant on every value-moving entry.
 *  - Owner can pause contributions in an emergency but can never alter a
 *    user's recorded entitlement, and can never sweep the tokens reserved
 *    for claims.
 *  - Deploy compiled with Solidity 0.8.19+ and EVM version "paris" or older:
 *    TVM builds without PUSH0 support reject Shanghai-era bytecode.
 */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

/// @notice Minimal SafeERC20 — also supports USDT-style tokens that return no bool.
library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _call(token, abi.encodeWithSignature("transfer(address,uint256)", to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _call(token, abi.encodeWithSignature("transferFrom(address,address,uint256)", from, to, value));
    }

    function _call(IERC20 token, bytes memory data) private {
        (bool ok, bytes memory ret) = address(token).call(data);
        require(ok, "SafeERC20: low-level call failed");
        if (ret.length > 0) {
            require(abi.decode(ret, (bool)), "SafeERC20: operation returned false");
        }
    }
}

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Ownable: zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

abstract contract Pausable is Ownable {
    bool public paused;

    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    function pause() external onlyOwner {
        require(!paused, "Pausable: not paused");
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        require(paused, "Pausable: not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }
}

abstract contract ReentrancyGuard {
    uint256 private _status = 1; // 1 = idle, 2 = inside a call

    modifier nonReentrant() {
        require(_status == 1, "ReentrancyGuard: reentrant call");
        _status = 2;
        _;
        _status = 1;
    }
}

contract OneWinPresale is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /* ------------------------------ constants ---------------------------- */

    /// Decimals used for USD amounts and stage prices (1 USD = 1_000_000).
    uint8 public constant USD_DECIMALS = 6;
    /// Decimals of the future $1WIN token. Update to match your mint.
    uint8 public constant TOKEN_DECIMALS = 18;

    struct Stage {
        uint256 tokenPriceUsd; // price of 1 token, 6 decimals (0.10 USD = 100_000)
        uint256 bonusBps;      // bonus in basis points (1_000 = 10%)
        uint64  startTime;     // unix seconds
        uint64  endTime;       // unix seconds
    }

    /* ------------------------------ storage ------------------------------ */

    Stage[] public stages;

    /// TRC-20 stablecoins accepted as payment (6-decimal USD pegs).
    mapping(address => bool) public acceptedStable;
    /// TRX reference price in USD, 6 decimals (0.33 USD = 330_000). Owner/oracle-set.
    uint256 public trxPriceUsd;
    /// Minimum contribution in USD, 6 decimals.
    uint256 public minContributionUsd;
    /// Wallet that receives swept proceeds.
    address public fundsWallet;

    mapping(address => uint256) public usdContributed;   // USD_DECIMALS
    mapping(address => uint256) public tokenEntitlement; // TOKEN_DECIMALS
    uint256 public totalUsdRaised;                       // USD_DECIMALS
    uint256 public totalTokensAllocated;                 // TOKEN_DECIMALS

    IERC20  public saleToken;
    bool    public claimEnabled;
    mapping(address => uint256) public claimed;
    uint256 public totalClaimed;

    /* ------------------------------- events ------------------------------ */

    event StageAdded(uint256 indexed id, uint256 tokenPriceUsd, uint256 bonusBps, uint64 startTime, uint64 endTime);
    event StablecoinSet(address indexed token, bool accepted);
    event TrxPriceSet(uint256 priceUsd);
    event MinContributionSet(uint256 usd);
    event FundsWalletSet(address wallet);
    event Contributed(address indexed buyer, address indexed paymentToken, uint256 paymentAmount, uint256 usdValue, uint256 tokensAllocated, uint256 stageId);
    event Swept(address indexed asset, address indexed to, uint256 amount);
    event ClaimEnabled(address token, uint256 depositedBalance);
    event Claimed(address indexed buyer, uint256 amount);

    /* ---------------------------- constructor ---------------------------- */

    constructor(address _fundsWallet, uint256 _minContributionUsd) {
        require(_fundsWallet != address(0), "funds wallet = zero address");
        fundsWallet = _fundsWallet;
        minContributionUsd = _minContributionUsd;
        emit FundsWalletSet(_fundsWallet);
        emit MinContributionSet(_minContributionUsd);
    }

    /* --------------------------- contributions --------------------------- */

    /// Plain TRX transfers contribute as well (the widget sends a simple sendTrx).
    receive() external payable {
        _contributeTrx();
    }

    /// Explicit TRX contribution entry point.
    function buyWithTrx() external payable {
        _contributeTrx();
    }

    function _contributeTrx() internal whenNotPaused nonReentrant {
        require(trxPriceUsd > 0, "TRX price not set");
        require(msg.value > 0, "no TRX sent");
        // msg.value is SUN (6 dp) → USD (6 dp): sunAmount * trxPriceUsd / 1e6
        uint256 usdValue = (msg.value * trxPriceUsd) / 1e6;
        _recordContribution(msg.sender, address(0), msg.value, usdValue);
    }

    /**
     * Contribute with an accepted TRC-20 stablecoin.
     * Caller must first run an exact-amount `approve(this, amount)` on the
     * token (stablecoins are assumed to use 6 decimals == USD_DECIMALS).
     */
    function buyWithToken(address token, uint256 amount) public whenNotPaused nonReentrant {
        require(acceptedStable[token], "stablecoin not accepted");
        require(amount > 0, "zero amount");

        // state first (CEI): a 6-decimal USD peg maps 1:1 onto USD_DECIMALS
        _recordContribution(msg.sender, token, amount, amount);

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    function _recordContribution(address buyer, address payToken, uint256 payAmount, uint256 usdValue) internal {
        require(usdValue >= minContributionUsd, "below minimum");

        (uint256 stageId, Stage memory s) = _activeStage();
        uint256 tokens = _tokensForUsd(usdValue, s.tokenPriceUsd, s.bonusBps);

        usdContributed[buyer]   += usdValue;
        tokenEntitlement[buyer] += tokens;
        totalUsdRaised          += usdValue;
        totalTokensAllocated    += tokens;

        emit Contributed(buyer, payToken, payAmount, usdValue, tokens, stageId);
    }

    function _tokensForUsd(uint256 usdValue, uint256 priceUsd, uint256 bonusBps) internal pure returns (uint256) {
        require(priceUsd > 0, "bad stage price");
        uint256 baseTokens = (usdValue * (10 ** uint256(TOKEN_DECIMALS))) / priceUsd;
        return (baseTokens * (10_000 + bonusBps)) / 10_000;
    }

    function _activeStage() internal view returns (uint256 id, Stage memory s) {
        uint256 len = stages.length;
        for (uint256 i = 0; i < len; i++) {
            Stage storage st = stages[i];
            if (block.timestamp >= st.startTime && block.timestamp < st.endTime) {
                return (i, st);
            }
        }
        revert("no active stage");
    }

    function stageCount() external view returns (uint256) {
        return stages.length;
    }

    /// Read-only helper for the website: how many tokens `usdValue` buys right now.
    function previewTokens(uint256 usdValue) external view returns (uint256 tokens, uint256 stageId) {
        (stageId, ) = _activeStageView();
        Stage memory s = stages[stageId];
        tokens = _tokensForUsd(usdValue, s.tokenPriceUsd, s.bonusBps);
    }

    function _activeStageView() internal view returns (uint256 id, Stage storage s) {
        uint256 len = stages.length;
        for (uint256 i = 0; i < len; i++) {
            if (block.timestamp >= stages[i].startTime && block.timestamp < stages[i].endTime) {
                return (i, stages[i]);
            }
        }
        revert("no active stage");
    }

    /* ------------------------------ claiming ----------------------------- */

    /// Owner deposits $1WIN, then enables self-serve claims (TGE).
    function enableClaim(IERC20 token) external onlyOwner {
        uint256 deposited = token.balanceOf(address(this));
        uint256 outstanding = totalTokensAllocated - totalClaimed;
        require(deposited >= outstanding, "deposit below allocations");
        saleToken = token;
        claimEnabled = true;
        emit ClaimEnabled(address(token), deposited);
    }

    /// Buyer withdraws their full remaining allocation.
    function claim() external nonReentrant {
        require(claimEnabled, "claim not enabled");
        uint256 owed = tokenEntitlement[msg.sender] - claimed[msg.sender];
        require(owed > 0, "nothing to claim");

        claimed[msg.sender] += owed;
        totalClaimed += owed;

        saleToken.safeTransfer(msg.sender, owed);
        emit Claimed(msg.sender, owed);
    }

    function claimable(address buyer) external view returns (uint256) {
        if (!claimEnabled) return 0;
        return tokenEntitlement[buyer] - claimed[buyer];
    }

    /* -------------------------------- admin ------------------------------ */

    function addStage(uint256 tokenPriceUsd, uint256 bonusBps, uint64 startTime, uint64 endTime) external onlyOwner {
        require(endTime > startTime, "bad stage window");
        stages.push(Stage({
            tokenPriceUsd: tokenPriceUsd,
            bonusBps: bonusBps,
            startTime: startTime,
            endTime: endTime
        }));
        emit StageAdded(stages.length - 1, tokenPriceUsd, bonusBps, startTime, endTime);
    }

    function setAcceptedStable(address token, bool accepted) external onlyOwner {
        require(token != address(0), "zero token");
        acceptedStable[token] = accepted;
        emit StablecoinSet(token, accepted);
    }

    function setTrxPriceUsd(uint256 priceUsd) external onlyOwner {
        require(priceUsd > 0, "zero price");
        trxPriceUsd = priceUsd;
        emit TrxPriceSet(priceUsd);
    }

    function setMinContributionUsd(uint256 usd) external onlyOwner {
        minContributionUsd = usd;
        emit MinContributionSet(usd);
    }

    function setFundsWallet(address wallet) external onlyOwner {
        require(wallet != address(0), "zero wallet");
        fundsWallet = wallet;
        emit FundsWalletSet(wallet);
    }

    /**
     * Sweep raised proceeds to `fundsWallet`.
     * - Native TRX: pass address(0).
     * - TRC-20: pass the token address. Tokens reserved for outstanding claims
     *   can never be swept.
     */
    function sweep(address asset) external onlyOwner nonReentrant {
        if (asset == address(0)) {
            uint256 bal = address(this).balance;
            require(bal > 0, "nothing to sweep");
            (bool ok, ) = fundsWallet.call{value: bal}("");
            require(ok, "TRX sweep failed");
            emit Swept(asset, fundsWallet, bal);
        } else {
            IERC20 token = IERC20(asset);
            uint256 bal = token.balanceOf(address(this));
            require(bal > 0, "nothing to sweep");
            if (claimEnabled && asset == address(saleToken)) {
                uint256 reserved = totalTokensAllocated - totalClaimed;
                require(bal > reserved, "tokens reserved for claims");
                bal -= reserved;
            }
            token.safeTransfer(fundsWallet, bal);
            emit Swept(asset, fundsWallet, bal);
        }
    }
}

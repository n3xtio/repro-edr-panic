// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

contract TOKEN is
Initializable,
ERC20Upgradeable,
ERC20BurnableUpgradeable,
ERC20PausableUpgradeable,
AccessControlUpgradeable,
UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
    bytes32 public constant BURNER_ROLE = keccak256('BURNER_ROLE');
    bytes32 public constant UPGRADER_ROLE = keccak256('UPGRADER_ROLE');

    // @custom:oz-upgrades-unsafe-allow constructor -- let's us initialize through proxy contract instead
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address minter,
        address burner,
        address upgrader
    ) public initializer {
        __ERC20_init('TOKEN', 'TOKEN');
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(BURNER_ROLE, burner);
        _grantRole(UPGRADER_ROLE, upgrader);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), 'Not admin');
        _;
    }

    modifier onlyBurner() {
        require(hasRole(BURNER_ROLE, _msgSender()), 'Not burner');
        _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, _msgSender()), 'Not minter');
        _;
    }

    function getContractVersion() public pure virtual returns (uint8) {
        return 1;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function decimals() public pure virtual override returns (uint8) {
        return 9;
    }

    function pause() public virtual onlyAdmin {
        _pause();
    }

    function unpause() public virtual onlyAdmin {
        _unpause();
    }

    function mint(address account, uint256 amount, bytes memory id) external virtual onlyMinter {
        _mint(account, amount);
        emit Mint(account, id, string(id), amount);
    }

    function burn(address account, uint256 amount, bytes memory id) external virtual onlyBurner {
        _burn(account, amount);
        emit Burn(account, id, string(id), amount);
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        super._update(from, to, value);
    }

    // Events in and out
    event Mint(address indexed to, bytes indexed filterRefId, string id, uint256 amount);
    event Burn(address indexed from, bytes indexed filterRefId, string id, uint256 amount);
}

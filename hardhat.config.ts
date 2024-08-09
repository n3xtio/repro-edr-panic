import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';

import { HardhatUserConfig } from 'hardhat/config';
import { accounts, namedAccounts } from './test-wallets';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  typechain: {
    discriminateTypes: true,
    outDir: './src/typechain-types',
    node16Modules: false,
    target: 'ethers-v6',
  },
  solidity: {
    compilers: [{ version: '0.8.20', settings: {} }],
  },
  namedAccounts: namedAccounts,
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 1000,
      },
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 30000000,
      gas: 12450000,
      initialBaseFeePerGas: 30000000,
      gasPrice: 30000000,
      accounts: accounts,
    }
  },
};

export default config;

import { HardhatUserConfig } from 'hardhat/types/config';
import { HardhatNetworkHDAccountsUserConfig } from 'hardhat/src/types/config';

const balance = '1000000000000000000000000000000';

const namedAccountsMap = {
  deployer: {
    privateKey: '0x70690fe6b4fa572a7f303adb6b5bc9e77c308435a652c3e9661389e69876d2f5',
    balance,
  },
  minter: {
    privateKey: '0x13c88a5414f45eb7d9d36323e23a274f6757a69dac08bd57c204ba2218bdc9ea',
    balance,
  },
  burner: {
    privateKey: '0x31017220df2944e9efc733fcb0f2b25e3c3250e276d5925e6e0e4cd5bc077d2d',
    balance,
  },
  proxy: {
    privateKey: '0x5a8f4f2d836f3e46f91b842926a8a2766ee61d381887ebcf7af830a2f37078e8',
    balance,
  },
  alice: {
    privateKey: '0x99c9dcf6d51db541a79c749aecc7789e6c7398a454b60aadb6fb2ba8e9edb3f4',
    balance,
  },
};

export const namedAccounts: HardhatUserConfig['namedAccounts'] = Object.keys(namedAccountsMap)
  .map((k, idx) => [k, idx])
  .reduce((acc, [k, idx]) => {
    acc[k] = idx as number;
    return acc;
  }, {} as any);

export const accounts: HardhatNetworkHDAccountsUserConfig = {
  mnemonic: 'test test test test test test test test test test test junk',
  count: Object.keys(namedAccountsMap).length,
  path: "m/44'/60'/0'/0/0",
  accountsBalance: balance,
  passphrase: 'test test test test test test test test passphrase',
};
// = Object.entries(namedAccountsMap).map(([, v]) => v);

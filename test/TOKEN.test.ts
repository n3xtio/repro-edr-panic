import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import * as hre from 'hardhat';
import {NonceManager} from 'ethers';
import { loadFixture, reset } from '@nomicfoundation/hardhat-network-helpers';
import '@nomiclabs/hardhat-ethers';
import {TOKEN} from '../src/typechain-types';

const TRANSFER_AMOUNT = '10000';
const TRANSACTION_SETTINGS = {
  gasLimit: hre.ethers.parseUnits(process.env.GAS_LIMIT || '20000000', 'wei'), // Adjust the gas limit as needed
};

after(async () => {
  await reset();
});

describe('Utilities', function () {
  it('should have named accounts', async function () {
    const namedAccounts = await hre.ethers.getSigners();
    assert.equal(namedAccounts.length, 5);
  });
  it('named accounts should have a NATIVE balance', async function () {
    const provider = hre.ethers.getDefaultProvider('http://127.0.0.1:8545/');
    const namedAccounts = await hre.ethers.getSigners();
    for (const account of namedAccounts) {
      assert.equal((await provider.getBalance(account.address)) > 0, true);
    }
  });
});

async function deployFixture() {
  const provider = hre.ethers.getDefaultProvider('http://127.0.0.1:8545/');
  // const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
  const admin = new NonceManager((await hre.ethers.getSigners())[0]).connect(provider);
  const minter = new NonceManager((await hre.ethers.getSigners())[1]).connect(provider);
  const burner = new NonceManager((await hre.ethers.getSigners())[2]).connect(provider);
  const proxy = new NonceManager((await hre.ethers.getSigners())[3]).connect(provider);
  const alice = new NonceManager((await hre.ethers.getSigners())[4]).connect(provider);

  const factory = await hre.ethers.getContractFactory('TOKEN', admin);
  // deploying uninitliazed contract
  const token = await factory.deploy(TRANSACTION_SETTINGS);
  await token.waitForDeployment();
  console.log('token.sol deployed to ', await token.getAddress());

  // JSON string containing the abi of a token function call and its required params
  const abiStorage = [
    'function initialize(address defaultAdmin, address minter, address burner, address upgrader)',
  ];
  // encode the abi and function data before sending to the deploy method
  const iface = new hre.ethers.Interface(abiStorage);
  const proxyData = iface.encodeFunctionData('initialize', [
    await admin.getAddress(),
    await minter.getAddress(),
    await burner.getAddress(),
    await proxy.getAddress(),
  ]);

  const proxyFactory = await hre.ethers.getContractFactory('TOKENProxy', proxy);
  // deploys and intializes token as part of proxy deploy
  const tokenProxy = await proxyFactory.deploy(await token.getAddress(), proxyData);
  await tokenProxy.waitForDeployment();
  console.log('tokenProxy.sol deployed to ', await tokenProxy.getAddress());
  const tokenProxyAttach = token.attach(await tokenProxy.getAddress()) as TOKEN;
  return { token: tokenProxyAttach, admin, minter, burner, alice, proxy };
}

describe('token initialization', function () {
  let deployment: Awaited<ReturnType<typeof deployFixture>>;
  before(async function () {
    deployment = await loadFixture(deployFixture);
  });
  it('deploys to local node', async function () {
    const { token } = deployment;
    assert.notEqual(token, undefined);
  });
  it('sets owner as DEFAULT_ADMIN_ROLE', async function () {
    const { token, admin } = deployment;
    const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
    assert.equal(await token.hasRole(DEFAULT_ADMIN_ROLE, await admin.getAddress()), true);
  });
  it('sets DEFAULT_ADMIN_ROLE role as ADMIN for MINTER/BURNER/ESCROW roles', async function () {
    const { token } = deployment;
    const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await token.MINTER_ROLE();
    const BURNER_ROLE = await token.BURNER_ROLE();
    assert.equal(await token.getRoleAdmin(MINTER_ROLE), DEFAULT_ADMIN_ROLE);
    assert.equal(await token.getRoleAdmin(BURNER_ROLE), DEFAULT_ADMIN_ROLE);
  });
  it('set MINTER, BURNER, ESCROW roles to the named accounts', async function () {
    const { token, minter, burner } = deployment;
    const MINTER_ROLE = await token.MINTER_ROLE();
    const BURNER_ROLE = await token.BURNER_ROLE();
    assert.equal(await token.hasRole(MINTER_ROLE, await minter.getAddress()), true);
    assert.equal(await token.hasRole(BURNER_ROLE, await burner.getAddress()), true);
  });
});
//
// describe('token MINT/BURN usage', function () {
//   let deployment: Awaited<ReturnType<typeof deployFixture>>;
//   before(async function () {
//     deployment = await loadFixture(deployFixture);
//   });
//   it("allows MINTER to mint into alice's wallet", async function () {
//     const { token, minter, alice } = deployment;
//     await token
//       .connect(minter)
//       .mint(await alice.getAddress(), TRANSFER_AMOUNT, hre.ethers.encodeBytes32String('blah'));
//     const balance = await token.balanceOf(await alice.getAddress());
//     assert.equal(balance.toString(), TRANSFER_AMOUNT);
//   });
//   it("allows BURNER to burn from alice's wallet", async function () {
//     const { token, minter, burner, alice } = deployment;
//     const aliceAddress = await alice.getAddress();
//     const initialBalance = await token.balanceOf(aliceAddress);
//     await token
//       .connect(minter)
//       .mint(aliceAddress, TRANSFER_AMOUNT, hre.ethers.encodeBytes32String('blah'));
//     let balance = await token.balanceOf(aliceAddress);
//     assert.equal(balance.toString(), (initialBalance + toBigInt(TRANSFER_AMOUNT)).toString());
//     await token.connect(alice).approve(burner, TRANSFER_AMOUNT);
//     await token.connect(burner).burnFrom(aliceAddress, TRANSFER_AMOUNT);
//     const expectedBalance = balance - toBigInt(TRANSFER_AMOUNT);
//     balance = await token.balanceOf(aliceAddress);
//     assert.equal(balance.toString(), expectedBalance.toString());
//   });
//   it('fails when a non-MINTER tries to mint', async function () {
//     const { token, burner, alice } = deployment;
//     const aliceAddress = await alice.getAddress();
//     await assert.rejects(
//       token
//         .connect(burner)
//         .mint(aliceAddress, TRANSFER_AMOUNT, hre.ethers.encodeBytes32String('blah')),
//     );
//   });
//   it('fails when a non-BURNER tries to burn', async function () {
//     const { token, minter, burner, alice } = deployment;
//     const aliceAddress = await alice.getAddress();
//     await token.connect(alice).approve(burner, TRANSFER_AMOUNT);
//     await assert.rejects(token.connect(minter).burnFrom(aliceAddress, TRANSFER_AMOUNT));
//   });
// });

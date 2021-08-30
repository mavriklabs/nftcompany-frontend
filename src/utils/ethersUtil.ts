import { add } from "lodash";

const ethers = require('ethers');

const Web3 = require('web3');
const OpenSeaPort = require('../../src-os/src').OpenSeaPort;
const Network = require('../../src-os/src').Network;
const WyvernSchemaName = require('../../src-os/src').WyvernSchemaName;

declare global {
  interface Window {
    ethereum: any;
  }
}
// const hstABI = require("human-standard-token-abi");

let provider: any;

export async function initEthers() {
  if (!window?.ethereum) {
    alert('Please install the MetaMask extension first.');
    return;
  }
  await window.ethereum.enable();
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const network = Number(window.ethereum.send({ method: 'net_version' }).result);
  return signer;
}

export const getProvider = () => provider;

export const getAccount = async () => {
  if (!window || !window.ethereum) {
    return null;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    // console.log('accounts', accounts);
    if (Array.isArray(accounts) && accounts.length > 0) {
      return accounts[0];
    }
  } catch (err) {
    console.error('ERROR:', err);
  }
  return null;
};

/* ------------ web3 utils ------------ */

export const web3GetCurrentProvider = () => {
  let web3 = new Web3();
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    // try {
    //   window.ethereum.enable().then(() => {
    //     // User has allowed account access to DApp...
    //   })
    // } catch (e) {
    //   // User has denied account access to DApp...
    // }
  } else if ((window as any).web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert('You have to install MetaMask !');
  }
  const currentProvider = web3.currentProvider;
  return currentProvider;
};

export const web3GetSeaport = () => {
  const seaport = new OpenSeaPort(web3GetCurrentProvider(), {
    networkName: Network.Main
  });
  return seaport;
}

export const getSchemaName = (address: string) => {
  // opensea shared store front
  if (address.toLowerCase() == '0x495f947276749ce646f68ac8c248420045cb7b5e') {
    return WyvernSchemaName.ERC1155
  } else {
    return WyvernSchemaName.ERC721
  }
}

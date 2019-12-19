import * as connext from '@connext/client';
import { CF_PATH } from "@connext/types";
import { AddressZero } from "ethers/constants";
import { parseEther } from "ethers/utils";
import { fromExtendedKey, fromMnemonic } from "ethers/utils/hdnode";
import Store from "./store";
require('dotenv').config();

// create new store, see `store.js`
const store = new Store(process.env.DB_FILE);

async function magicalChannelMagic() {
console.log(`playing around with connext, a series of bugs knitted together to work magically a meaningful percentage of the time`);

// // MAINNET
// const options: ClientOptions = {
//   mnemonic: 'machine dismiss fame stamp idea baby bubble panther unit kick question blind extend learn order always ribbon scrub dignity hobby brown cry rare rapid',
//   ethProviderUrl: `https://daicard.io/api/ethprovider`,
//   nodeUrl: `wss://daicard.io/api/messaging`,
//   store
// }

const mnemonic = process.env.RINKEBY_MNEMONIC;

// youll see a lot to do with your xpub and free balance address,
// lets log those here before we get started.
const hdNode = fromExtendedKey(fromMnemonic(mnemonic).extendedKey).derivePath(CF_PATH);
const xpub = hdNode.neuter().extendedKey;
// the free balance address is what will be used to deposit from
// when calling `channel.deposit`, so it must be loaded
const freeBalanceAddr = connext.utils.xpubToAddress(xpub);

console.log(`using xpub: ${xpub}`);
console.log(`free balance address: ${freeBalanceAddr}`);

// RINKEBY
// 3 ETH on 0x38ab31363527c36322B611D6dFfd8D8FCF3d9D3F
// 2 ETH on 0x3150cf6A66dE378B5b155C274CcF548effbb87cE
const options = {
  mnemonic,
  nodeUrl: 'nats://staging.indra.connext.network/api/messaging',
  ethProviderUrl: `https://staging.indra.connext.network/api/ethprovider`,
  store
};
// rpcProviderUrl	String	the Web3 provider URL used by the client
// nodeUrl	String	url of the node
// mnemonic?	String	(optional) Mnemonic of the signing wallet
// externalWallet?	any	(optional) External wallet address
// channelProvider?	ChannelProvider	(optional) Injected ChannelProvider
// keyGen?	() => Promise	Function passed in by wallets to generate ephemeral keys
// store?	object	Maps to set/get from CF. Defaults localStorage
// logLevel?	number	Depth of logging
// natsUrl?	String	Initially hardcoded
// natsClusterId?	String	Initially hardcoded
// natsToken?	String	Initially hardcoded
console.log(`generated opts, trying to connect`);

const channel = await connext.connect(options);
console.log(`channel connected with options:`);
console.log(`   - mnemonic: ${options.mnemonic}`)
console.log(`   - nodeUrl: ${options.nodeUrl}`)
console.log(`   - ethProviderUrl: ${options.ethProviderUrl}`)
console.log(`   - publicIdentifier: ${channel.publicIdentifier}`)
console.log(`   - freeBalanceAddress: ${channel.freeBalanceAddress}`)


// // Making a deposit in ETH
// import { AddressZero } from "ethers/constants";
// import { parseEther } from "ethers/utils";
//
const payload = {
  amount: parseEther("0.1").toString(), // in wei/wad (ethers.js methods are very convenient for getting wei amounts)
  assetId: AddressZero // Use the AddressZero constant from ethers.js to represent ETH, or enter the token address
}
console.log(`created deposit payload, registering listeners`);

channel.on("DEPOSIT_STARTED_EVENT", (data) => {
  console.log(`Your deposit has begun: ${JSON.stringify(data, null, 2)}`)
});
channel.on("DEPOSIT_CONFIRMED_EVENT", async (data) => {
  console.log(`Your deposit has completed: ${JSON.stringify(data, null, 2)}`)
  const fb = await channel.getFreeBalance()
  console.log(`Updated user eth balance: ${fb[channel.freeBalanceAddress].toString()}`)
});
// channel.on("")
console.log(`listeners registered, calling deposit`);

await channel.deposit(payload)

// // Exchanging Wei for Dai
// import { AddressZero } from "ethers/constants";
// import { parseEther } from "ethers/utils";
//
// const payload: SwapParams = {
//   amount: parseEther("0.1").toString() // in wei (ethers.js methods are very convenient for getting wei amounts)
//   toAssetId: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359" // Dai
//   fromAssetId: AddressZero // ETH
// }
//
// await channel.swap(payload)

// // Transferring ETH
// import { AddressZero } from "ethers/constants";
// import { parseEther } from "ethers/utils";

const payload = {
  recipient: "xpub6EFZf2akgmkPEy49K4xmZgwfspYRjfy89j3WUCtbk53XAeZApE7dDWJrTv7nvoQPYWEY9w5zjnR5PmGKUh9FBWJiJsSoyb6vNPKQYELr7HS"  // <-- Laptop  //counterparty's xPub // Desktop: xpub6E4pdmd9dV7vWMExS4ComHiPj7STndSmyWJWyn4G2U8sDGcxwp4V6TDkS2WScCCMtUtfFSaND69HySuZag25PG7K7PoYYVxABWtm5tZip2f
  meta: "Metadata for transfer" // any string value, or omit
  amount: parseEther("0.1").toString() // in wei (ethers.js methods are very convenient for getting wei amounts)
  assetId: AddressZero // ETH
}
//
await channel.transfer(payload)

// // Withdrawing ETH
// import { AddressZero } from "ethers/constants";
// import { parseEther } from "ethers/utils";
//
// const payload: WithdrawParams = {
//   recipient: // defaults to signer xpub but can be changed to withdraw to any recipient
//   amount: parseEther("0.1").toString() // in wei (ethers.js methods are very convenient for getting wei amounts)
//   assetId: AddressZero
// }
//
// await channel.withdraw(payload)

// var channelAvailable = await channel.getChannel()).available
// if (!channelAvailable) {
//   console.warn(`Channel not available yet.`);
//   return;
// }
//

// Available connext events to listen to are:
// export const ConnextEvents = {
//   CREATE_CHANNEL_EVENT: "CREATE_CHANNEL_EVENT",
//   DEPOSIT_CONFIRMED_EVENT: "DEPOSIT_CONFIRMED_EVENT",
//   DEPOSIT_FAILED_EVENT: "DEPOSIT_FAILED_EVENT",
//   DEPOSIT_STARTED_EVENT: "DEPOSIT_STARTED_EVENT",
//   INSTALL_EVENT: "INSTALL_EVENT",
//   INSTALL_VIRTUAL_EVENT: "INSTALL_VIRTUAL_EVENT",
//   RECIEVE_TRANSFER_FAILED_EVENT: "RECIEVE_TRANSFER_FAILED_EVENT",
//   RECIEVE_TRANSFER_FINISHED_EVENT: "RECIEVE_TRANSFER_FINISHED_EVENT",
//   RECIEVE_TRANSFER_STARTED_EVENT: "RECIEVE_TRANSFER_STARTED_EVENT",
//   REJECT_INSTALL_EVENT: "REJECT_INSTALL_EVENT",
//   UNINSTALL_EVENT: "UNINSTALL_EVENT",
//   UNINSTALL_VIRTUAL_EVENT: "UNINSTALL_VIRTUAL_EVENT",
//   UPDATE_STATE_EVENT: "UPDATE_STATE_EVENT",
//   WITHDRAWAL_CONFIRMED_EVENT: "WITHDRAWAL_CONFIRMED_EVENT",
//   WITHDRAWAL_FAILED_EVENT: "WITHDRAWAL_FAILED_EVENT",
//   WITHDRAWAL_STARTED_EVENT: "WITHDRAWAL_STARTED_EVENT",
//   PROPOSE_INSTALL_EVENT: "PROPOSE_INSTALL_EVENT",
//   PROTOCOL_MESSAGE_EVENT: "PROTOCOL_MESSAGE_EVENT"
// };
// and can be imported as:
// import { ConnextEvents, ConnextEvent } from "@connext/types"
//
// connext.on("DEPOSIT_STARTED", () => {
//   console.log("Your deposit has begun")
//   this.showDepositStarted()
// });

}
magicalChannelMagic();

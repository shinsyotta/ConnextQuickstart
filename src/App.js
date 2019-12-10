import * as connext from '@connext/client';
import { AddressZero } from "ethers/constants";
import { parseEther } from "ethers/utils";

export const store = {
  get: (path) => {
    const raw = localStorage.getItem(`CF_NODE:${path}`)
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    // Handle partial matches so the following line works -.-
    // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
    if (path.endsWith("channel") || path.endsWith("appInstanceIdToProposedAppInstance")) {
      const partialMatches = {}
      for (const k of Object.keys(localStorage)) {
        if (k.includes(`${path}/`)) {
          try {
            partialMatches[k.replace('CF_NODE:', '').replace(`${path}/`, '')] = JSON.parse(localStorage.getItem(k))
          } catch {
            partialMatches[k.replace('CF_NODE:', '').replace(`${path}/`, '')] = localStorage.getItem(k)
          }
        }
      }
      return partialMatches;
    }
    return raw;
  },
  set: (pairs, allowDelete) => {
    for (const pair of pairs) {
      localStorage.setItem(
        `CF_NODE:${pair.path}`,
        typeof pair.value === 'string' ? pair.value : JSON.stringify(pair.value),
      );
    }
  }
};

// // MAINNET
// const options: ClientOptions = {
//   mnemonic: 'machine dismiss fame stamp idea baby bubble panther unit kick question blind extend learn order always ribbon scrub dignity hobby brown cry rare rapid',
//   ethProviderUrl: `https://daicard.io/api/ethprovider`,
//   nodeUrl: `wss://daicard.io/api/messaging`,
//   store
// }

// RINKEBY
// 3 ETH on 0x38ab31363527c36322B611D6dFfd8D8FCF3d9D3F
const options = {
  mnemonic: 'machine dismiss fame stamp idea baby bubble panther unit kick question blind extend learn order always ribbon scrub dignity hobby brown cry rare rapid',
  nodeUrl: 'nats://rinkeby.indra.connext.network/api/messaging',
  ethProviderUrl: `https://rinkeby.indra.connext.network/api/ethprovider`,
  store
}

const channel = connext.connect(options)

// // Making a deposit in ETH
// import { AddressZero } from "ethers/constants";
// import { parseEther } from "ethers/utils";
//
// const payload: AssetAmount = {
//   amount: parseEther("0.1").toString(), // in wei/wad (ethers.js methods are very convenient for getting wei amounts)
//   assetId: AddressZero // Use the AddressZero constant from ethers.js to represent ETH, or enter the token address
// }
//
// channel.deposit(payload)

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
//
// const payload: TransferParams = {
//   recipient: "xpub1abcdef"  //counterparty's xPub
//   meta: "Metadata for transfer" // any string value, or omit
//   amount: parseEther("0.1").toString() // in wei (ethers.js methods are very convenient for getting wei amounts)
//   assetId: AddressZero // ETH
// }
//
// await channel.transfer(payload)

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
// CHALLENGE_INITIATED
// CHALLENGE_RESPONDED
// CHALLENGE_RESOLVED
// COUNTER_DEPOSIT_CONFIRMED
// CREATE_CHANNEL
// DEPOSIT_CONFIRMED
// DEPOSIT_FAILED
// DEPOSIT_STARTED
// INSTALL
// INSTALL_VIRTUAL
// PROPOSE_INSTALL
// PROPOSE_INSTALL_VIRTUAL
// PROPOSE_STATE
// PROTOCOL_MESSAGE_EVENT
// REJECT_INSTALL
// REJECT_INSTALL_VIRTUAL
// REJECT_STATE
// UNINSTALL
// UNINSTALL_VIRTUAL
// UPDATE_STATE
// WITHDRAW_EVENT
// WITHDRAWAL_CONFIRMED
// WITHDRAWAL_FAILED
// WITHDRAWAL_STARTED
//
// connext.on("DEPOSIT_STARTED", () => {
//   console.log("Your deposit has begun")
//   this.showDepositStarted()
// });

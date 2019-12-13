import { ConnextClientStorePrefix } from "@connext/types";
const fs = require("fs")

export default class Store {
  // This is a simple store class designed to use a json file
  // as a key value store, great for starting up non-web based
  // implementations!
  //
  // In addition to the `get` and `set` functions, there are also
  // `reset` and `restore` functions. The `reset` function will
  // remove all entries in the store that are related to the channel
  // while the `restore` function will try to import state from a
  // watchtower service. 
  //
  // Currently, Connext is supported by the Pisa watchtower
  // service on Rinkeby only. However, feel free to implement
  // your own state back up service! Just reach out to the Connext team
  // for any help (since this is not documented yet). If no watchtower
  // service is implemented, you can still restore your state from the
  // node in a trusted way. It is important to note that the node will
  // not have any record of any virtual app instance state updates, so
  // if you frequently use virtual apps it may be worth it to implement
  // your own backup service.
  //
  // This implementation is based off of the store implementation found
  // here:
  // https://github.com/ConnextProject/indra/blob/staging/modules/payment-bot/src/store.ts
  constructor(dbFile, pisaClient, wallet) {
    // the name of the .json file being used for the database
    this.dbFile = dbFile;
    // `pisaClient` and `wallet` params are optional!
    // pisaClient === watchtower client
    this.pisaClient = pisaClient;
    // wallet is used to sign backups sent to the pisa client
    this.wallet = wallet;

    // add this.storeObj
    this.storeObj = {};
  }

  async get(path) {
    if (!this.storeObj) {
      this.storeObj = JSON.parse(fs.readFileSync(this.dbFile, "utf8") || "{}");
    }
    const raw = this.storeObj[`${path}`];
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
      const partialMatches = {};
      for (const k of Object.keys(this.storeObj)) {
        if (k.includes(`${path}/`)) {
          try {
            partialMatches[
              k.replace(`${path}/`, "")
            ] = JSON.parse(this.storeObj[k]);
          } catch {
            partialMatches[
              k.replace(`${path}/`, "")
            ] = this.storeObj[k];
          }
        }
      }
      return partialMatches;
    }
    return raw;
  }

  async set(
    // each `pair` has the structure:
    // { path: string, value: any }, and
    // `pairs` is an array of `pair` objects
    pairs,
    shouldBackup = false,
  ) {
    if (!this.storeObj) {
      this.storeObj = JSON.parse(fs.readFileSync(this.dbFile, "utf8") || "{}");
    }
    for (const pair of pairs) {
      this.storeObj[`${pair.path}`] =
        typeof pair.value === "string" ? pair.value : JSON.stringify(pair.value);
      if (
        shouldBackup &&
        this.pisaClient &&
        pair.path.match(/\/xpub.*\/channel\/0x[0-9a-fA-F]{40}/) &&
        pair.value.freeBalanceAppInstance &&
        this.wallet
      ) {
        try {
          console.log(`Backing up store value at path ${pair.path}`);
          await this.pisaClient.backUp(
            (digest) => this.wallet.signMessage(arrayify(digest)),
            this.wallet.address,
            hexlify(toUtf8Bytes(JSON.stringify(pair))),
            await this.wallet.provider.getBlockNumber(),
            keccak256(toUtf8Bytes(pair.path)),
            pair.value.freeBalanceAppInstance.latestVersionNumber,
          );
        } catch (e) {
          // If we get a "nonce too low" error, we'll log & ignore bc sometimes expected. See:
          // see: https://github.com/counterfactual/monorepo/issues/2497
          if (e.message && e.message.match(/Appointment already exists and nonce too low./)) {
            console.warn(e);
          } else {
            console.error(e);
          }
        }
      }
    }
    fs.unlinkSync(this.dbFile);
    fs.writeFileSync(this.dbFile, JSON.stringify(this.storeObj, null, 2));
  }

  async reset() {
    if (!this.storeObj) {
      this.storeObj = JSON.parse(fs.readFileSync(this.dbFile, "utf8") || "{}");
    }
    for (const k of Object.keys(this.storeObj)) {
      if (k.startsWith(ConnextClientStorePrefix)) {
        delete this.storeObj[k];
      }
    }
    delete this.storeObj[`${ConnextClientStorePrefix}:EXTENDED_PRIVATE_KEY`];
    fs.unlinkSync(this.dbFile);
    fs.writeFileSync(this.dbFile, JSON.stringify(this.storeObj, null, 2));
  }

  async restore() {
    return this.pisaClient && this.wallet
      ? (
          await this.pisaClient.restore(
            (digest) => this.wallet.signMessage(arrayify(digest)),
            this.wallet.address,
            await this.wallet.provider.getBlockNumber(),
          )
        ).map(b => JSON.parse(toUtf8String(arrayify(b.data))))
      : [];
  }
}
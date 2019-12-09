import Controller from "./controller";
import { Rpc } from "./types";

export default class Router {
  protected controllers: Array<typeof Controller>;

  constructor({ controllers }: { controllers: Array<typeof Controller> }) {
    this.controllers = controllers;
  }

  async dispatch(rpc: Rpc) {
    const controller = Object.values(Controller.rpcMethods).find(mapping => mapping.method === rpc.methodName);

    if (!controller) {
      console.warn(`Cannot execute ${rpc.methodName}: no controller`);
      return;
    }

    return new controller.type()[controller.callback](rpc.parameters);
  }
}

import Controller from "../controller";
import { Rpc, JsonApiOperation } from "../types";

export function jsonApiType(name: string) {
  return (target: typeof Controller) => {
    target.jsonapiType = name;

    const functions = Object.getOwnPropertyNames(target.prototype).filter(key => key !== "constructor");

    // Type overriden operations.
    functions
      .filter(func => Object.values(target.rpcMethods).find(method => method.callback === func))
      .forEach(method => {
        const descriptor = Object.entries(target.rpcMethods).find(
          ([, mapping]) => mapping.callback === method && mapping.method.includes("[type]")
        );

        if (!descriptor) {
          return;
        }

        const [key, originalMapping] = descriptor;

        target.rpcMethods[key] = {
          ...target.rpcMethods[key],
          method: originalMapping.method.replace("[type]", target.jsonapiType)
        };
      });

    // Map new functions.
    functions
      .filter(func => !Object.values(target.rpcMethods).find(method => method.callback === func))
      .forEach(method => {
        jsonApiOperation(method, target)(target.prototype, method);
      });
  };
}

export function jsonApiOperation(name: string, forcedConstructor?: typeof Controller) {
  return (target: Controller, propertyKey: string) => {
    const constructor = forcedConstructor || <typeof Controller>target.constructor;
    const key = `${target.constructor.name}:${name}`;

    constructor.rpcMethods[key] = {
      method: `${constructor.jsonapiType || "[type]"}:${name}`,
      callback: propertyKey,
      type: constructor
    };
  };
}

export function jsonApiDeserialize(payload: JsonApiOperation): Rpc {
  return {
    methodName: `${payload.ref.type}:${payload.op}`,
    parameters: payload
  };
}

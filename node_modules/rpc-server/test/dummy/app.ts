import {
  Router,
  Controller,
  jsonApiType,
  jsonRpcMethod,
  jsonApiOperation,
  jsonRpcDeserialize,
  jsonApiDeserialize
} from "../../src";

@jsonApiType("channel")
class JsonApiChannelController extends Controller {
  @jsonApiOperation("installApp")
  async create(op: any) {
    return `JSONAPI: I've created a channel called ${op.data.attributes.name}`;
  }

  async get(op: any) {
    return `JSONAPI: I've found a channel by its ID ${op.ref.id}`;
  }
}

class JsonRpcChannelController extends Controller {
  @jsonRpcMethod("chan_installApp")
  async create({ name }: { name: string }) {
    return `JSONRPC: I've created a channel called ${name}`;
  }
}

@jsonApiType("channel2")
class MixedFormatChannelController extends Controller {
  @jsonApiOperation("installApp")
  public async jsonApiCreate(op: any) {
    return `MixedFormat/JSONAPI: I've created a channel called ${op.data.attributes.name}`;
  }

  @jsonRpcMethod("chan2_installApp")
  public async jsonRpcCreate({ name }: { name: string }) {
    return `MixedFormat/JSONRPC: I've created a channel called ${name}`;
  }
}

const router = new Router({
  controllers: [JsonApiChannelController, JsonRpcChannelController, MixedFormatChannelController]
});

(async () => {
  console.log("Mapping", Controller.rpcMethods);

  console.log();

  console.log(
    "chan_installApp RPC:",
    await router.dispatch(
      jsonRpcDeserialize({ jsonrpc: "2.0", id: 1, method: "chan_installApp", params: { name: "Joey" } })
    )
  );

  console.log();

  console.log(
    "channel:installApp JsonApi:",
    await router.dispatch(
      jsonApiDeserialize({
        op: "installApp",
        ref: {
          type: "channel"
        },
        data: {
          attributes: {
            name: "Joey"
          }
        }
      })
    )
  );

  console.log();

  console.log(
    "channel:get JsonApi:",
    await router.dispatch(
      jsonApiDeserialize({
        op: "get",
        ref: {
          type: "channel",
          id: "123"
        }
      })
    )
  );

  console.log();

  console.log(
    "chan2_installApp RPC:",
    await router.dispatch(
      jsonRpcDeserialize({ jsonrpc: "2.0", id: 1, method: "chan2_installApp", params: { name: "Foo" } })
    )
  );

  console.log();

  console.log(
    "channel2:installApp JSONAPI",
    await router.dispatch(
      jsonApiDeserialize({
        op: "installApp",
        ref: {
          type: "channel2"
        },
        data: {
          attributes: {
            name: "Foo"
          }
        }
      })
    )
  );

  console.log();
})();

```
Matthews-iMac:QuickStartConnextApp matthewlally$ npm start

> quickstartconnextapp@1.0.0 start /Users/matthewlally/Development/ConnextExperiments/QuickStartConnextApp
> node -r esm src/App.js

secp256k1 unavailable, reverting to browser version
#1
#2
(node:44751) UnhandledPromiseRejectionWarning: Create channel event not fired within 30s
(node:44751) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:44751) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
(node:44751) UnhandledPromiseRejectionWarning: NatsError: Request timed out.
    at Function.errorForCode (/Users/matthewlally/Development/ConnextExperiments/QuickStartConnextApp/node_modules/ts-nats/lib/error.js:125:16)
    at Timeout.<anonymous> (/Users/matthewlally/Development/ConnextExperiments/QuickStartConnextApp/node_modules/ts-nats/lib/nats.js:264:42)
    at listOnTimeout (internal/timers.js:531:17)
    at processTimers (internal/timers.js:475:7)
(node:44751) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

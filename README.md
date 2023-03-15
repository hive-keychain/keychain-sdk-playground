### SDK-Playground

The playground can be used to understand how to use the keychain requests. Any time you select a request, the code will be shown next to the input parameters, so you can copy & paste the typescript code and use it.

#### Useful links

- [SDK-playground repository](https://github.com/hive-keychain/keychain-sdk-playground)
- [keychain-sdk](https://github.com/hive-keychain/keychain-sdk)

#### How to install

- Clone `https://github.com/hive-keychain/keychain-sdk-playground.git`
- `npm install`
- `npm run start`
- You will need to have installed the keychain-sdk, just follow the next instructions

#### Install keychain-sdk

- `npm install hive-keychain/keychain-sdk`

#### How to use the sdk

The keychain-sdk allows you to override the rpc node to transmit the operations.
To instatiate a new class, just follow the sample code bellow.

- No rpc options needed.

```
const keychain = new KeychainSDK(window);
try
  {
    const encodeMessage = await keychain.encode(formParams);
    console.log({ encodeMessage });
   } catch (error) {
    console.log({ error });
}
```

- Rpc options needed.

```
const options = { rpc: 'https://rpcnode-url '};
const keychain = new KeychainSDK(window, options);
try
  {
    const encodeMessage = await keychain.encode(formParams);
    console.log({ encodeMessage });
   } catch (error) {
    console.log({ error });
}
```

#### React Hook Example

Even when the keychain-sdk will detect if the extension is installed on your browser, to be sure as a best practice, you can use a hook to wait until all scripts have been loaded. This ensure the extension has all scripts libraries to work with.

```
useEffect(() => {
    const onLoadHandler = async () => {
      console.log('Fully loaded!');
      try {
        const enabled = await keychain.isKeyChainInstalled();
        console.log({ KeychainDetected: enabled });
        //
        //run all the code you need for your requests.
        //
      } catch (error) {
        console.log({ error });
      }
    };

    window.addEventListener('load', onLoadHandler);

    return () => {
      window.removeEventListener('load', onLoadHandler);
    };
  });
```

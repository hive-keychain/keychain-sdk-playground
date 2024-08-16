import { KeychainRequestTypes, KeychainSDK } from "keychain-sdk";
import {
  IFrameDimensions,
  SwapWidgetCardFormParams,
} from "../components/routes/swap-widget-card";

const BASE_SWAP_WIDGET_URL = "https://swapwidget.hive-keychain.com/";

let sdk: KeychainSDK;

const getSDK = () => {
  if (!sdk) {
    sdk = new KeychainSDK(window);
  }
  return sdk;
};

const fromCodeToText = (
  formParams: any,
  requestType: KeychainRequestTypes | string
) => {
  if (!requestType) return;

  const capitalizedCastedType =
    requestType[0].toUpperCase() + requestType.substring(1, requestType.length);

  let requestObject = "";

  if (formParams.data) {
    const formParamsOptions = `${
      formParams.options
        ? `,
              formParamsAsObject.options`
        : ""
    });`;
    requestObject = `await keychain
         .${
           requestType === "swap"
             ? "swaps.start"
             : requestType === "vscCallContract"
             ? "vsc.callContract"
             : requestType === "vscDeposit"
             ? "vsc.deposit"
             : requestType
         }(
              formParamsAsObject.data as ${
                capitalizedCastedType === "SignTx"
                  ? "any"
                  : capitalizedCastedType
              }${formParamsOptions}`;
  } else {
    requestObject = `await keychain
         .${requestType}(formParamsAsObject as ${capitalizedCastedType});`;
  }
  const extraCodeLines = formParams.broadcastSignedTx
    ? `const client = new Client([
      "https://api.hive.blog",
      "https://api.openhive.network",
    ]);
    let signedTxBroadcast = await client.broadcast.send(signtx.result as any);
    console.log({ signedTxBroadcast });`
    : `console.log({ ${requestType.toLowerCase()} });`;

  const stringifyed = `${JSON.stringify(formParams, undefined, "     ")}`;

  const temp = stringifyed
    .replace(/"method": "Active"/g, `"method" : KeychainKeyTypes.active`)
    .replace(/"method": "Posting"/g, `"method" : KeychainKeyTypes.posting`)
    .replace(/"method": "Memo"/g, `"method" : KeychainKeyTypes.memo`)
    .replace(/"role": "Active"/g, `"role" : KeychainKeyTypes.active`)
    .replace(/"role": "Posting"/g, `"role" : KeychainKeyTypes.posting`)
    .replace(/"role": "Memo"/g, `"role" : KeychainKeyTypes.memo`)
    .replace(
      /"steps": \[\]/g,
      `"steps": ${!formParams.data ? [] : "estimation.steps"}`
    );

  return `try
  {
    const keychain = new KeychainSDK(window);
    ${
      formParams.data?.steps &&
      `const serverStatus = await sdk.swap.getServerStatus();
    // handle cases where the server is stopped, in maintenance, or behind blocks
    const config = await sdk.swap.getConfig();
    // getting swap configs, such as fees and allowed slippage
    const estimation = await sdk.swaps.getEstimation(${formParams.data.amount},"${formParams.data.startToken}","${formParams.data.endToken}",config)
    // gets initial estimation
    `
    }
    const formParamsAsObject = ${temp}
    
    const ${requestType.toLowerCase()} = ${requestObject}
    ${extraCodeLines}
  } catch (error) {
    console.log({ error });
  }`;
};

const sortByKeyNames = (a: any, b: any, key: string) => {
  const nameA = a[key].toUpperCase();
  const nameB = b[key].toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

const fromCodeToTextIframe = (
  params: SwapWidgetCardFormParams,
  iframeDimensions: IFrameDimensions
) => {
  let addedParams = "";
  Object.entries(params).forEach((k, v) => {
    if (!["username"].includes(k[0])) {
      addedParams += `&${k[0]}=${k[1]}`;
    }
  });
  let finalUrl = `${BASE_SWAP_WIDGET_URL}?username=${params.username}${addedParams}`;

  return `
    <iframe
    id="swapWidgetkeychain"
    title="Swap Tokens with Keychain"
    src="${finalUrl}"
    allow="clipboard-write"
    width="${iframeDimensions.width}"
    height="${iframeDimensions.height}"
    />
  `;
};

export const Utils = {
  fromCodeToText,
  sortByKeyNames,
  getSDK,
  fromCodeToTextIframe,
  BASE_SWAP_WIDGET_URL,
};

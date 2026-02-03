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
             : requestType === "vscWithdrawal"
             ? "vsc.withdraw"
             : requestType === "vscTransfer"
             ? "vsc.transfer"
             : requestType === "vscStaking"
             ? "vsc.staking"
             : requestType === "savingsDeposit"
             ? "savings.deposit"
             : requestType === "savingsWithdraw"
             ? "savings.withdraw"
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
  let extraCodeLines = formParams.broadcastSignedTx
    ? `const client = new Client([
      "https://api.hive.blog",
      "https://api.openhive.network",
    ]);
    let signedTxBroadcast = await client.broadcast.send(signtx.result as any);
    console.log({ signedTxBroadcast });`
    : `console.log({ ${requestType}Res });`;

  if (requestType.startsWith("vsc")) {
    extraCodeLines += `
      const confirmationStatus = await sdk.vsc.awaitConfirmation(${requestType}Res.result.id);
      console.log({ confirmationStatus });
      `;
  }

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
      formParams.data?.steps
        ? `const serverStatus = await sdk.swap.getServerStatus();
    // handle cases where the server is stopped, in maintenance, or behind blocks
    const config = await sdk.swap.getConfig();
    // getting swap configs, such as fees and allowed slippage
    const estimation = await sdk.swaps.getEstimation(${formParams.data.amount},"${formParams.data.startToken}","${formParams.data.endToken}",config)
    // gets initial estimation
    `
        : ""
    }
    const formParamsAsObject = ${temp}
    
    const ${requestType}Res = ${requestObject}
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
  let finalUrl = `${BASE_SWAP_WIDGET_URL}?${
    params.username ? `username=` : ""
  }${params.username ?? ``}${addedParams}`;

  return `
    <iframe
    id="swapWidgetkeychain"
    title="Swap Tokens with Keychain"
    src="${finalUrl}"
    allow="clipboard-write"
    ${iframeDimensions.width ? `width="${iframeDimensions.width}"` : ""}
    ${iframeDimensions.height ? `height="${iframeDimensions.height}"` : ""}
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

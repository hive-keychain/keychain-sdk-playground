import { KeychainRequestTypes } from "hive-keychain-commons";
import { KeychainSDK } from "keychain-sdk";

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

  if (formParams.options && Object.keys(formParams.options).length === 0) {
    delete formParams.options;
  }
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
         .${requestType}(
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

  //TODO check the pattern + extract & reuse...
  let arrayParam = ["{"];
  for (const [key, value] of Object.entries(formParams)) {
    if (typeof value === "object" && key === "data") {
      let dataArray = ["{"];
      for (const [innerKey, innerValue] of Object.entries(value as object)) {
        if (innerKey === "method") {
          dataArray.push(
            `\t\t"${innerKey}": KeychainKeyTypes.${(
              innerValue as string
            ).toLowerCase()},`
          );
        } else {
          dataArray.push(`\t\t"${innerKey}": "${innerValue}",`);
        }
      }
      dataArray.push("\t}");
      arrayParam.push(`\t"data": ${dataArray.join("\n")},`);
    } else {
      if (key === "method") {
        arrayParam.push(
          `\t"${key}": KeychainKeyTypes.${(value as string).toLowerCase()},`
        );
      } else {
        arrayParam.push(
          `\t"${key}": "${
            typeof value === "object"
              ? JSON.stringify(value, undefined, "\t\t")
              : value
          }",`
        );
      }
    }
  }
  arrayParam.push("\t}");

  return `try
  {
    const keychain = new KeychainSDK(window);
    const formParamsAsObject = ${arrayParam.join("\n")};
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

export const Utils = { fromCodeToText, sortByKeyNames, getSDK };

import { KeychainRequestTypes } from "hive-keychain-commons";

const fromCodeToText = (
  formParams: any,
  requestType: KeychainRequestTypes | string
) => {
  if (!requestType) return;
  const capitalized =
    requestType[0].toUpperCase() + requestType.substring(1, requestType.length);

  const requestObjectCall = !formParams.data
    ? `await keychain
              .${requestType}(formParamsAsObject as ${capitalized});`
    : `await keychain
              .${requestType}(formParamsAsObject.data as ${capitalized},
              formParamsAsObject.options)`;

  return `try
  {
    const keychain = new KeychainSDK(window);
    const formParamsAsObject = ${JSON.stringify(formParams, undefined, "    ")};
    const ${requestType.toLowerCase()} = ${requestObjectCall};
    console.log({ ${requestType.toLowerCase()} });
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

export const Utils = { fromCodeToText, sortByKeyNames };

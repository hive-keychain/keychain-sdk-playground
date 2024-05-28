let rpc = "https://api.hive-engine.com/rpc";

const getApi = () => {
  return rpc;
};

const getTokensMarket = async (
  query: {},
  limit: number,
  offset: number,
  indexes: {}[]
): Promise<any[]> => {
  return await get<any[]>({
    contract: "market",
    table: "metrics",
    query: query,
    limit: limit,
    offset: offset,
    indexes: indexes,
  });
};

const getAllTokens = async (): Promise<any[]> => {
  let tokens = [];
  let offset = 0;
  do {
    const newTokens = await getTokens(offset);
    tokens.push(...newTokens);
    offset += 1000;
  } while (tokens.length % 1000 === 0);
  return tokens;
};

const getTokens = async (offset: number) => {
  return (
    await get<any[]>({
      contract: "tokens",
      table: "tokens",
      query: {},
      limit: 1000,
      offset: offset,
      indexes: [],
    })
  ).map((t: any) => {
    return {
      ...t,
      metadata: JSON.parse(t.metadata),
    };
  });
};

const get = async <T>(params: any, timeout: number = 10): Promise<T> => {
  const url = `${getApi()}/contracts`;
  return new Promise((resolve, reject) => {
    let resolved = false;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "find",
        params,
        id: 1,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res && res.status === 200) {
          resolved = true;
          return res.json();
        }
      })
      .then((res: any) => {
        resolve(res.result as unknown as T);
      });

    setTimeout(() => {
      if (!resolved) {
        reject(new Error("html_popup_tokens_timeout"));
      }
    }, timeout * 1000);
  });
};

export const SwapWidgetCardUtils = {
  getAllTokens,
  getTokensMarket,
};

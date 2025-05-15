import { useEffect, useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { CopyBlock, solarizedDark } from "react-code-blocks";
import { useDebouncedCallback } from "use-debounce";
import { SwapWidgetCardUtils } from "../../utils/swap-widget-card.utils";
import { Utils } from "../../utils/utils";

export interface SwapWidgetCardFormParams {
  username?: string;
  partnerUsername?: string;
  partnerFee?: number;
  from?: string;
  to?: string;
  slippage?: string;
  rpc?: string;
  hiveEngineRpc?: string;
  theme?: string;
}

export interface IFrameDimensions {
  width: string;
  height: string;
}

const IFRAME_SUGGESTED_DIMENSIONS: IFrameDimensions = {
  width: "435",
  height: "435",
};

const SwapWidgetCard = () => {
  const [iframeDimensions, setIframeDimensions] = useState<IFrameDimensions>(
    IFRAME_SUGGESTED_DIMENSIONS
  );
  const [missingMandatoryParams, setMissingMandatoryParams] = useState(false);
  const [iframeURL, setIframeURL] = useState<string>(
    `${Utils.BASE_SWAP_WIDGET_URL}?username=theghost1980`
  );
  const [loadingAllTokens, setLoadingAllTokens] = useState(true);
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const lastUsernameFound =
    localStorage.getItem("last_username") || "keychain.tests";
  const [formParams, setFormParams] = useState<SwapWidgetCardFormParams>({
    username: lastUsernameFound,
  });

  const debouncedFormHook = useDebouncedCallback((e) => {
    const { name, value } = e.target;
    if (String(value).trim().length > 0) {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        [name]: value,
      }));
    } else {
      const tempFormParams = { ...formParams };
      delete tempFormParams[name as keyof SwapWidgetCardFormParams];
      setFormParams(tempFormParams);
    }
  }, 1000);

  const debouncedDimensionsHook = useDebouncedCallback((e) => {
    const { name, value } = e.target;
    if (String(value).trim().length > 0) {
      setIframeDimensions((prevDim) => {
        return { ...prevDim, [name]: value };
      });
    } else {
      const tempIFrameDimensions = { ...iframeDimensions };
      delete tempIFrameDimensions[name as keyof IFrameDimensions];
      setIframeDimensions(tempIFrameDimensions);
    }
  }, 1000);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (formParams.username) {
      let addedParams = "";
      Object.entries(formParams).forEach((k, v) => {
        if (!["username"].includes(k[0])) {
          addedParams += `&${k[0]}=${k[1]}`;
        }
      });
      let finalUrl = `${Utils.BASE_SWAP_WIDGET_URL}?username=${formParams.username}${addedParams}`;
      setIframeURL(finalUrl);
      setMissingMandatoryParams(false);
    } else {
      console.log("Missing mandatory params!");
      setMissingMandatoryParams(true);
    }
  }, [formParams]);

  const init = async () => {
    //tokenMarket
    try {
      const tempTokensMarket = await SwapWidgetCardUtils.getTokensMarket(
        {},
        1000,
        0,
        []
      );
      setAllTokens([
        { symbol: "HIVE" },
        { symbol: "HBD" },
        ...tempTokensMarket,
      ]);
    } catch (error) {
      console.log("Hive tokens market error!", { error });
    } finally {
      setLoadingAllTokens(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col lg={true} className="mb-3">
          <Card className="d-flex justify-content-center">
            <Card.Header as={"h4"}>Keychain Swap Widget Params</Card.Header>
            <Card.Body>
              <Container className="mt-2">
                <Form onSubmit={() => {}}>
                  <Container className="d-flex flex-row justify-content-between">
                    <Card.Text className="mb-3">Mandatory Field</Card.Text>
                    {missingMandatoryParams && (
                      <Card.Text className="fw-light fs-6">
                        Missing Params!
                      </Card.Text>
                    )}
                  </Container>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Username</InputGroup.Text>
                    <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
                    <Form.Control
                      placeholder="Hive username"
                      name="username"
                      defaultValue={formParams.username}
                      onChange={(e) => debouncedFormHook(e)}
                    />
                  </InputGroup>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Header>Optional Fields</Accordion.Header>
                    <Accordion.Body>
                      <Container className="p-0 mb-3">
                        <InputGroup>
                          <InputGroup.Text>Partner username</InputGroup.Text>
                          <InputGroup.Text className="normal">
                            @
                          </InputGroup.Text>{" "}
                          <Form.Control
                            placeholder="Partner username"
                            name="partnerUsername"
                            defaultValue={formParams.partnerUsername}
                            onChange={(e) => debouncedFormHook(e)}
                          />
                        </InputGroup>
                        {formParams.partnerUsername && (
                          <>
                            <Form.Text className="d-block text-center">
                              Tip: Specify the partner fee that will be received
                              by this username (0-1 %)
                            </Form.Text>
                            <InputGroup className="mt-2 mb-3">
                              <InputGroup.Text>Partner fee</InputGroup.Text>
                              <Form.Control
                                placeholder="Partner fee"
                                name="partnerFee"
                                defaultValue={formParams.partnerFee}
                                onChange={(e) => debouncedFormHook(e)}
                                type="number"
                              />
                            </InputGroup>
                          </>
                        )}
                      </Container>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>IFrame Width</InputGroup.Text>
                        <Form.Control
                          placeholder="Iframe window width"
                          name="width"
                          defaultValue={iframeDimensions.width}
                          onChange={(e) => debouncedDimensionsHook(e)}
                          type="number"
                        />
                      </InputGroup>
                      <Container className="p-0 mb-3">
                        <InputGroup>
                          <InputGroup.Text>IFrame Height</InputGroup.Text>
                          <Form.Control
                            placeholder="Iframe window height"
                            name="height"
                            defaultValue={iframeDimensions.height}
                            onChange={(e) => debouncedDimensionsHook(e)}
                            type="number"
                          />
                        </InputGroup>
                        {(parseFloat(iframeDimensions.width) <
                          parseFloat(IFRAME_SUGGESTED_DIMENSIONS.width) ||
                          parseFloat(iframeDimensions.height) <
                            parseFloat(IFRAME_SUGGESTED_DIMENSIONS.height) ||
                          !iframeDimensions.width ||
                          !iframeDimensions.height) && (
                          <Form.Text className="d-block text-center">
                            We suggest using minimum w:{" "}
                            {IFRAME_SUGGESTED_DIMENSIONS.width}
                            px & h:
                            {IFRAME_SUGGESTED_DIMENSIONS.height}px
                          </Form.Text>
                        )}
                      </Container>

                      <InputGroup className="mb-3">
                        <InputGroup.Text>From</InputGroup.Text>
                        <Form.Select
                          onChange={(e) => debouncedFormHook(e)}
                          defaultValue={formParams.from}
                          name="from"
                        >
                          {loadingAllTokens ? (
                            <option>Try to load tokens...</option>
                          ) : (
                            <option>Please select a valid token symbol</option>
                          )}
                          {!loadingAllTokens &&
                            allTokens.length &&
                            allTokens.map((token, index) => {
                              return (
                                <option
                                  key={`${token.symbol}-widget-from-option-${index}`}
                                  value={token.symbol}
                                >
                                  {token.symbol}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>To</InputGroup.Text>
                        <Form.Select
                          onChange={(e) => debouncedFormHook(e)}
                          defaultValue={formParams.to}
                          name="to"
                        >
                          {loadingAllTokens ? (
                            <option>Try to load tokens...</option>
                          ) : (
                            <option>Please select a valid token symbol</option>
                          )}
                          {!loadingAllTokens &&
                            allTokens.length &&
                            allTokens.map((token, index) => {
                              return (
                                <option
                                  key={`${token.symbol}-widget-to-option-${index}`}
                                  value={token.symbol}
                                >
                                  {token.symbol}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Slippage</InputGroup.Text>
                        <Form.Control
                          placeholder="Swap slippage"
                          name="slippage"
                          defaultValue={formParams.slippage}
                          onChange={(e) => debouncedFormHook(e)}
                          type="number"
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>RPC</InputGroup.Text>
                        <Form.Control
                          placeholder="RPC"
                          name="rpc"
                          defaultValue={formParams.rpc}
                          onChange={(e) => debouncedFormHook(e)}
                          type="string"
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Hive Engine RPC</InputGroup.Text>
                        <Form.Control
                          placeholder="Hive Engine RPC"
                          name="hiveEngineRpc"
                          defaultValue={formParams.hiveEngineRpc}
                          onChange={(e) => debouncedFormHook(e)}
                          type="string"
                        />
                      </InputGroup>
                    </Accordion.Body>
                  </Accordion>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={true}>
          <Card className="d-flex">
            <Card.Header as={"h4"}>Live Sample + Code</Card.Header>
            <Card.Body>
              <Container className="d-flex flex-column justify-content-center mt-2">
                <CopyBlock
                  text={Utils.fromCodeToTextIframe(
                    formParams,
                    iframeDimensions
                  )}
                  language={"typescript"}
                  showLineNumbers={false}
                  startingLineNumber={1}
                  wrapLines
                  theme={solarizedDark}
                />
                <Container className="d-flex flex-column justify-content-center align-items-center mt-1">
                  <iframe
                    id="swapWidgetkeychain"
                    title="Swap Tokens with Keychain"
                    src={iframeURL}
                    allow="clipboard-write"
                    width={iframeDimensions.width}
                    height={iframeDimensions.height}
                  />
                </Container>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SwapWidgetCard;

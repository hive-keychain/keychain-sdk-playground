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
  username: string;
  partnerUsername: string;
  partnerFee: number;
  from?: string;
  to?: string;
  slipperage?: string;
  theme?: string;
}

export interface IFrameDimensions {
  width: string;
  height: string;
}

const SwapWidgetCard = () => {
  const [iframeDimensions, setIframeDimensions] = useState<IFrameDimensions>({
    width: "435",
    height: "400",
  });
  const [missingMandatoryParams, setMissingMandatoryParams] = useState(false);
  const [iframeURL, setIframeURL] = useState<string>(
    "http://localhost:8080/?username=theghost1980&from=hive&to=hbd&slipperage=5&partnerUsername=sexosentido&partnerFee=1"
  );
  const [loadingAllTokens, setLoadingAllTokens] = useState(true);
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const lastUsernameFound =
    localStorage.getItem("last_username") || "keychain.tests";
  const [formParams, setFormParams] = useState<SwapWidgetCardFormParams>({
    username: lastUsernameFound,
    partnerFee: 1,
    partnerUsername: lastUsernameFound,
  });

  const debouncedFormHook = useDebouncedCallback((e) => {
    const { name, value } = e.target;
    setFormParams((prevFormParams) => ({
      ...prevFormParams,
      [name]: value,
    }));
  }, 1000);

  const debouncedDimensionsHook = useDebouncedCallback((e) => {
    const { name, value } = e.target;
    setIframeDimensions((prevDim) => {
      return { ...prevDim, [name]: value };
    });
  }, 1000);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (
      formParams.username &&
      formParams.partnerUsername &&
      formParams.partnerFee
    ) {
      let addedParams = "";
      Object.entries(formParams).forEach((k, v) => {
        if (!["username", "partnerUsername", "partnerFee"].includes(k[0])) {
          addedParams += `&${k[0]}=${k[1]}`;
        }
      });
      let finalUrl = `http://localhost:8080/?username=${formParams.username}&partnerUsername=${formParams.partnerUsername}&partnerFee=${formParams.partnerFee}${addedParams}`;
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
      setAllTokens(tempTokensMarket);
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
                    <Card.Text className="mb-3">Mandatory Fields</Card.Text>
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
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Partner username</InputGroup.Text>
                    <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
                    <Form.Control
                      placeholder="Partner username"
                      name="partnerUsername"
                      defaultValue={formParams.partnerUsername}
                      onChange={(e) => debouncedFormHook(e)}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Partner fee</InputGroup.Text>
                    <Form.Control
                      placeholder="Partner fee"
                      name="partnerFee"
                      defaultValue={formParams.partnerFee}
                      onChange={(e) => debouncedFormHook(e)}
                    />
                  </InputGroup>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Header>Optional Fields</Accordion.Header>
                    <Accordion.Body>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>IFrame Width</InputGroup.Text>
                        <Form.Control
                          placeholder="Iframe window width"
                          name="width"
                          defaultValue={iframeDimensions.width}
                          onChange={(e) => debouncedDimensionsHook(e)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>IFrame Height</InputGroup.Text>
                        <Form.Control
                          placeholder="Iframe window height"
                          name="height"
                          defaultValue={iframeDimensions.height}
                          onChange={(e) => debouncedDimensionsHook(e)}
                        />
                      </InputGroup>
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
                        <InputGroup.Text>Slipperage</InputGroup.Text>
                        <Form.Control
                          placeholder="Swap slipperage"
                          name="slipperage"
                          defaultValue={formParams.slipperage}
                          onChange={(e) => debouncedFormHook(e)}
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
                    style={{
                      border: "1px solid",
                      padding: "8px",
                    }}
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

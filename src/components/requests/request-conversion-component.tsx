import { KeychainSDK } from "keychain-sdk";
import { Convert } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_PARAMS: Convert = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  amount: "1.000",
  collaterized: false,
};
const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = ["rpc"];

const sdk = new KeychainSDK(window);

const RequestConversionComponent = ({
  setRequestResult,
  setFormParamsToShow,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Convert;
    options: KeychainOptions;
  }>({
    data: DEFAULT_PARAMS,
    options: DEFAULT_OPTIONS,
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    const tempValue =
      undefinedParamsToValidate.findIndex((param) => param === name) !== -1 &&
      value.trim() === ""
        ? undefined
        : value;
    if (
      Object.keys(formParams.data).findIndex((param) => param === name) !== -1
    ) {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        data: { ...prevFormParams.data, [name]: tempValue },
      }));
    } else {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        options: { ...prevFormParams.options, [name]: tempValue },
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const conversion = await sdk.convert(formParams.data, formParams.options);
      setRequestResult(conversion);
      console.log({ conversion });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Conversion</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              title="Hive account to perform the request"
              placeholder="Hive username"
              name="username"
              value={formParams.data.username}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3 align-items-center">
            <InputGroup.Text>
              {formParams.data.collaterized ? "HIVE to HBD" : "HBD to HIVE"}
            </InputGroup.Text>
            <Form.Check
              className="ms-3"
              type="switch"
              id="custom-switch"
              title={
                "true to convert HIVE to HBD. false to convert HBD to HIVE."
              }
              value={formParams.data.collaterized ? "true" : "false"}
              onChange={(e) =>
                handleFormParams({
                  target: {
                    name: "collaterized",
                    value: e.target.checked,
                  },
                })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>
            <Form.Control
              title="Amount to be converted. Requires 3 decimals, i.e: '1.000'."
              placeholder="amount i.e: '1.000'"
              name="amount"
              value={formParams.data.amount}
              onChange={handleFormParams}
            />
            <InputGroup.Text>
              {formParams.data.collaterized ? "HIVE" : "HBD"}
            </InputGroup.Text>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Rpc</InputGroup.Text>
            <Form.Control
              placeholder="Rpc node to broadcast - optional"
              name="rpc"
              value={formParams.options.rpc}
              onChange={handleFormParams}
            />
          </InputGroup>
          <Button variant="primary" type="submit" className="mt-1">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestConversionComponent;

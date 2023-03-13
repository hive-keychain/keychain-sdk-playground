import { KeychainSDK } from "keychain-sdk";
import { Delegation } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_PARAMS: Delegation = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  delegatee: localStorage.getItem("last_username") || "keychain.tests",
  amount: "1.000",
  unit: "HP",
};
const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = ["username", "rpc"];

const sdk = new KeychainSDK(window);

const RequestDelegationComponent = ({
  setRequestResult,
  setFormParamsToShow,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Delegation;
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
      const delegation = await sdk.delegation(
        formParams.data,
        formParams.options
      );
      setRequestResult(delegation);
      console.log({ delegation });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Delegation</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              placeholder="Hive username, leave blank for dropdown"
              name="username"
              value={formParams.data.username}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Delegatee</InputGroup.Text>
            <Form.Control
              placeholder="Account to receive the delegation"
              name="delegatee"
              value={formParams.data.delegatee}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>
            <Form.Control
              placeholder="Requires 3 decimals, i.e: '1.000'"
              name="amount"
              value={formParams.data.amount}
              onChange={handleFormParams}
            />
            <Form.Select
              onChange={handleFormParams}
              value={formParams.data.unit}
              name="unit"
            >
              <option>Please select a UNIT</option>
              <option value={"HP"}>HP</option>
              <option value={"VESTS"}>VESTS</option>
            </Form.Select>
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

export default RequestDelegationComponent;

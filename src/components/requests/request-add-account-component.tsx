import { RequestAddAccountKeys } from "hive-keychain-commons";
import { KeychainSDK } from "keychain-sdk";
import { AddAccount } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { CommonProps } from "../request-selector-component";

type Props = {};

const DEFAULT_PARAMS: AddAccount = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  keys: {
    posting: undefined,
    active: undefined,
    memo: undefined,
  } as RequestAddAccountKeys,
};

const sdk = new KeychainSDK(window);

const RequestAddAccountComponent = ({
  setRequestResult,
  enableLogs,
  setFormParamsToShow,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<AddAccount>(DEFAULT_PARAMS);

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    if (name === "username") {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        username: value,
      }));
    } else {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        keys: { ...prevFormParams.keys, [name]: value },
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (enableLogs) console.log("about to process ...: ", { formParams });
    try {
      const addAccount = await sdk.addAccount(formParams);
      setRequestResult(addAccount);
      if (enableLogs) console.log({ addAccount });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Add Account</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              title="Hive account to perform the request"
              placeholder="Hive username"
              name="username"
              value={formParams.username}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Posting</InputGroup.Text>
            <Form.Control
              title="private keys of the account : {active:'...',posting:'...',memo:'...'}. At least one must be specified."
              placeholder="Posting private key"
              name="posting"
              value={formParams.keys.posting}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Active</InputGroup.Text>
            <Form.Control
              title="private keys of the account : {active:'...',posting:'...',memo:'...'}. At least one must be specified."
              placeholder="Active private key"
              name="active"
              value={formParams.keys.active}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo</InputGroup.Text>
            <Form.Control
              title="private keys of the account : {active:'...',posting:'...',memo:'...'}. At least one must be specified."
              placeholder="Memo private key"
              name="memo"
              value={formParams.keys.memo}
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

export default RequestAddAccountComponent;

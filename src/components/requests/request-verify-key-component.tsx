import { KeychainKeyTypes } from "hive-keychain-commons";
import { KeychainSDK } from "keychain-sdk";
import { Decode } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};
//TODO check why changes the width of the container when adding message to decode
const DEFAULT_PARAMS: Decode = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  message: "#message to encode here, # is required",
  method: KeychainKeyTypes.active,
};

const sdk = new KeychainSDK(window);

const RequestVerifyKeyComponent = ({
  setRequestResult,
  setFormParamsToShow,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<Decode>(DEFAULT_PARAMS);

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    if (value !== "") {
      setFormParams((prevFormParams) => ({ ...prevFormParams, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process: ", { formParams });
    try {
      const verifyKey = await sdk.decode(formParams);
      setRequestResult(verifyKey);
      console.log({ verifyKey });
    } catch (error) {
      setRequestResult(error);
    }
  };
  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request verify key</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <CustomToolTip
              placement={"top"}
              toolTipText={fieldToolTipText.username}
            >
              <Form.Control
                placeholder="Hive username"
                name="username"
                value={formParams.username}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Message</InputGroup.Text>
            <CustomToolTip
              placement={"top"}
              toolTipText={fieldToolTipText.messageToDecode}
            >
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="To Decode. # is required"
                name="message"
                value={formParams.message}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Method</InputGroup.Text>
            <Form.Select
              onChange={handleFormParams}
              value={formParams.method}
              name="method"
            >
              <option>Please select a Method</option>
              <option value={KeychainKeyTypes.active}>
                {KeychainKeyTypes.active}
              </option>
              <option value={KeychainKeyTypes.posting}>
                {KeychainKeyTypes.posting}
              </option>
              <option value={KeychainKeyTypes.memo}>
                {KeychainKeyTypes.memo}
              </option>
            </Form.Select>
          </InputGroup>
          <Button variant="primary" type="submit" className="mt-1">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestVerifyKeyComponent;

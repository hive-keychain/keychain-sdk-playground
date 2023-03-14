import { KeychainKeyTypes } from "hive-keychain-commons";
import { Encode } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};

const DEFAULT_PARAMS: Encode = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  receiver: "keychain.tests",
  message: "#Keychain SDK v 1.0",
  method: KeychainKeyTypes.active,
};

const RequestEncodeMessageComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<Encode>(DEFAULT_PARAMS);

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
      const encodeMessage = await sdk.encode(formParams);
      setRequestResult(encodeMessage);
      console.log({ encodeMessage });
    } catch (error) {
      setRequestResult(error);
    }
  };
  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request encode message</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <CustomToolTip
              children={
                <Form.Control
                  placeholder="Hive username"
                  name="username"
                  value={formParams.username}
                  onChange={handleFormParams}
                />
              }
              placement={"top"}
              toolTipText={fieldToolTipText.username}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Receiver @</InputGroup.Text>
            <Form.Control
              placeholder="Hive receiver's username"
              name="receiver"
              value={formParams.receiver}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Message</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="To encode. # is required"
              name="message"
              value={formParams.message}
              onChange={handleFormParams}
            />
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

export default RequestEncodeMessageComponent;

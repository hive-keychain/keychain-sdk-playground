import { KeychainKeyTypes } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};

const RequestEncodeWithKeysComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<any>({
    username: lastUsernameFound,
    publicKeys: ["STM7KKUZb1CzwRiaN2RQcGeJUpcHM5BmCNudxXW21xqktBe91RpD8"],
    message: "#Keychain SDK v 1.0",
    method: KeychainKeyTypes.posting,
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    let { name, value } = e.target;

    if (name === "publicKeys") {
      console.log(value);
      value = value.split(",");
    }
    setFormParams((prevFormParams: any) => ({
      ...prevFormParams,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process: ", { formParams });
    try {
      const encodeMessage = await sdk.encodeWithKeys({
        ...formParams,
        publicKeys: formParams.publicKeys,
      });
      console.log({ encodeMessage });
      setRequestResult(encodeMessage);
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
            <InputGroup.Text>Username</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
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
            <InputGroup.Text>
              Public Keys (use ',' to separate public keys)
            </InputGroup.Text>
            <Form.Control
              placeholder="Public keys"
              name="publicKeys"
              value={formParams.publicKeys}
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

export default RequestEncodeWithKeysComponent;

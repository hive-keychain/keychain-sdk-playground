import { KeychainKeyTypes } from "hive-keychain-commons";
import { Login } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["username", "message", "title", "rpc"];

const RequestLoginComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Login;
  }>({
    data: {
      username: lastUsernameFound,
      message: '{"login":"123"}',
      method: KeychainKeyTypes.posting,
      title: "Login",
    },
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
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const login = await sdk.login(formParams.data);
      setRequestResult(login);
      console.log({ login });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Login</Card.Header>
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
                  value={formParams.data.username}
                  onChange={handleFormParams}
                />
              }
              placement={"top"}
              toolTipText={fieldToolTipText.username}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Message</InputGroup.Text>
            <CustomToolTip
              children={
                <Form.Control
                  placeholder="Message to sign"
                  name="message"
                  value={formParams.data.message}
                  onChange={handleFormParams}
                />
              }
              placement={"top"}
              toolTipText={fieldToolTipText.messageLogin}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Method</InputGroup.Text>
            <Form.Select
              onChange={handleFormParams}
              value={formParams.data.method}
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
          <InputGroup className="mb-3">
            <InputGroup.Text>Title</InputGroup.Text>
            <CustomToolTip
              children={
                <Form.Control
                  name="title"
                  value={formParams.data.title}
                  onChange={handleFormParams}
                />
              }
              placement={"top"}
              toolTipText={fieldToolTipText.titlePopUp}
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

export default RequestLoginComponent;

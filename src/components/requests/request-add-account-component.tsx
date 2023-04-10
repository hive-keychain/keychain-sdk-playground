import { RequestAddAccountKeys } from "hive-keychain-commons";
import { AddAccount } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};

const RequestAddAccountComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<AddAccount>({
    username: lastUsernameFound,
    keys: {
      posting: "5ft....",
      active: "5ft....",
      memo: "5ft....",
    } as RequestAddAccountKeys,
  });

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
    console.log("about to process ...: ", { formParams });
    try {
      const addAccount = await sdk.addAccount(formParams);
      setRequestResult(addAccount);
      console.log({ addAccount });
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
            <InputGroup.Text>Username</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
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
            <InputGroup.Text>Posting</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Private posting key, as '5d1d...'"}
            >
              <Form.Control
                placeholder="Posting private key"
                name="posting"
                value={formParams.keys.posting}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Active</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Private active key, as '5d1d...'"}
            >
              <Form.Control
                placeholder="Active private key"
                name="active"
                value={formParams.keys.active}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Private memo key, as '5d1d...'"}
            >
              <Form.Control
                placeholder="Memo private key"
                name="memo"
                value={formParams.keys.memo}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <Button variant="primary" type="submit" className="mt-1">
            Submit
          </Button>
          <Container>
            <Row className="text-center">
              <Form.Text muted>At least one key must be specified.</Form.Text>
            </Row>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestAddAccountComponent;

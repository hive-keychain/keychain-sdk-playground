import { SendToken } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestSendTokenComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: SendToken;
    options?: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      to: lastUsernameFound,
      amount: "0.001",
      memo: "#Test Keychain SDK transfer(will be encrypted)",
      currency: "LEO",
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
      if (String(tempValue).trim().length === 0 || !tempValue) {
        const copyState = { ...formParams };
        delete copyState.options;
        setFormParams(copyState);
      } else {
        setFormParams((prevFormParams) => ({
          ...prevFormParams,
          options: { ...prevFormParams.options, [name]: tempValue },
        }));
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const sendToken = await sdk.sendToken(
        formParams.data,
        formParams.options
      );
      setRequestResult(sendToken);
      console.log({ sendToken });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Send Token</Card.Header>
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
                value={formParams.data.username}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Receiver</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
              toolTipText={"Hive username to receive"}
            >
              <Form.Control
                placeholder="Hive username to receive"
                name="to"
                value={formParams.data.to}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Token Symbol</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Token symbol to be sent, i.e: 'LEO'"}
            >
              <Form.Control
                placeholder="Token symbol"
                name="currency"
                value={formParams.data.currency}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Amount to be transfered. Requires 3 decimals i.e: '0.001'"
              }
            >
              <Form.Control
                placeholder="Amount to be transfered. Requires 3 decimals i.e: '0.001'"
                name="amount"
                value={formParams.data.amount}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Memo of transfer. Use # to encrypt."}
            >
              <Form.Control
                placeholder="Memo of transfer. Use # to encrypt."
                name="memo"
                value={formParams.data.memo}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Rpc</InputGroup.Text>
            <Form.Control
              placeholder="Rpc node to broadcast - optional"
              name="rpc"
              value={formParams.options?.rpc}
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

export default RequestSendTokenComponent;

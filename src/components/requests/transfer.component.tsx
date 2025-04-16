import { Transfer } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestTransferComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_PARAMS: Transfer = {
    username: lastUsernameFound,
    to: lastUsernameFound,
    amount: "1.000",
    memo: "#Test Keychain SDK transfer(will be encrypted)",
    enforce: false,
    currency: "HIVE",
  };
  const [formParams, setFormParams] = useState<{
    data: Transfer;
    options?: KeychainOptions;
  }>({
    data: DEFAULT_PARAMS,
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
      if (!formParams.data.username?.length) {
        delete formParams.data.username;
      }
      const transfer = await sdk.transfer(formParams.data, formParams.options);
      setRequestResult(transfer);
      console.log({ transfer });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Transfer</Card.Header>
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
            <InputGroup.Text>Amount</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Amount to be transfered. Requires 3 decimals i.e: '1.000'"
              }
            >
              <Form.Control
                placeholder="Amount to be transfered. Requires 3 decimals i.e: '1.000'"
                name="amount"
                value={formParams.data.amount}
                onChange={handleFormParams}
              />
            </CustomToolTip>
            <Form.Select
              onChange={handleFormParams}
              value={formParams.data.currency}
              name="currency"
            >
              <option>Please select a Currency</option>
              <option value={"HIVE"}>HIVE</option>
              <option value={"HBD"}>HBD</option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Memo of transfer. Use # to encrypt"}
            >
              <Form.Control
                placeholder="Memo of transfer. Use # to encrypt."
                name="memo"
                value={formParams.data.memo}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="d-flex mb-3 align-items-center">
            <InputGroup.Text>Enforce</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "If set to true, user cannot chose to make the transfer from another account"
              }
            >
              <Form.Check
                className="ms-3"
                type="checkbox"
                name="enforce"
                value={formParams.data.enforce ? "true" : "false"}
                onChange={(e) =>
                  handleFormParams({
                    target: {
                      value: e.target.checked,
                      name: e.target.name,
                    },
                  })
                }
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

export default RequestTransferComponent;

import { SavingsDeposit } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";
import { Utils } from "../../utils/utils";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestSavingsDepositComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const lastToFound = Utils.getLastTo();
  const [formParams, setFormParams] = useState<{
    data: SavingsDeposit;
    options?: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      to: lastToFound || lastUsernameFound,
      amount: "0.001",
      currency: "HIVE",
      memo: "",
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
    if (name === "to") {
      const toValue =
        tempValue === undefined || tempValue === null
          ? ""
          : String(tempValue);
      Utils.rememberTo(toValue);
    }
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
    try {
      if (!formParams.data.username?.length) {
        delete formParams.data.username;
      }
      const savingsDeposit = await sdk.savings.deposit(
        formParams.data,
        formParams.options
      );
      setRequestResult(savingsDeposit);
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Savings Deposit</Card.Header>
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
            <InputGroup.Text>To</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
              toolTipText={"Hive account receiving the savings deposit"}
            >
              <Form.Control
                placeholder="Receiver username"
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
                "Amount to be deposited. Requires 3 decimals i.e: '0.001'"
              }
            >
              <Form.Control
                placeholder="Amount i.e: '0.001'"
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
              toolTipText={"Memo for savings deposit."}
            >
              <Form.Control
                placeholder="Memo for savings deposit."
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

export default RequestSavingsDepositComponent;

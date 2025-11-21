import { RecurrentTransfer } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestRecurrentTransferComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_PARAMS: RecurrentTransfer = {
    username: lastUsernameFound,
    to: "keychain",
    amount: "1.000",
    currency: "HIVE",
    memo: "#Encrypted memo sample",
    recurrence: 24,
    executions: 2,
    pair_id: 0,
  };
  const [formParams, setFormParams] = useState<{
    data: RecurrentTransfer;
    options?: KeychainOptions;
  }>({
    data: DEFAULT_PARAMS,
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    const { name, value, type } = e.target;
    // Convert to number if input type is number or field is numeric
    const numericFields = ["recurrence", "executions", "pair_id"];
    const isNumericField = numericFields.includes(name);
    const shouldConvertToNumber = type === "number" || isNumericField;

    let processedValue = value;
    if (shouldConvertToNumber && value !== "" && !isNaN(Number(value))) {
      processedValue = Number(value);
    }

    const tempValue =
      undefinedParamsToValidate.findIndex((param) => param === name) !== -1 &&
      String(processedValue).trim() === ""
        ? undefined
        : processedValue;
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
      const rTransfer = await sdk.recurrentTransfer(
        formParams.data,
        formParams.options
      );
      setRequestResult(rTransfer);
      console.log({ rTransfer });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Recurrent Transfer</Card.Header>
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
              toolTipText={"Hive account receiving the transfers"}
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
                "Amount to be sent on each execution. Requires 3 decimals, i.e: '1.000'."
              }
            >
              <Form.Control
                placeholder="Amount to send"
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
              <option>Please select a currency</option>
              <option value={"HIVE"}>HIVE</option>
              <option value={"HBD"}>HBD</option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Transfer memo, use # to encrypt"}
            >
              <Form.Control
                as={"textarea"}
                placeholder="transfer memo"
                name="memo"
                value={formParams.data.memo}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Recurrence</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "How often will the payment be triggered (in hours) - minimum 24"
              }
            >
              <Form.Control
                placeholder="Recurrence i.e: '24'"
                name="recurrence"
                value={formParams.data.recurrence}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Executions</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "The times the recurrent payment will be executed - minimum 2"
              }
            >
              <Form.Control
                placeholder="executions i.e: '2'"
                name="executions"
                value={formParams.data.executions}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Pair ID</InputGroup.Text>
            <Form.Control
              placeholder="Pair ID"
              type="number"
              name="pair_id"
              value={formParams.data.pair_id}
              onChange={handleFormParams}
            />
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

export default RequestRecurrentTransferComponent;

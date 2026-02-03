import { VscDeposit } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";
import { Utils } from "../../utils/utils";

type Props = {};

const undefinedParamsToValidate = ["username", "to", "rpc"];

const RequestVscDepositComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const lastToFound = Utils.getLastTo();
  const DEFAULT_PARAMS: VscDeposit = {
    username: lastUsernameFound,
    to: lastToFound || undefined,
    amount: "0.001",
    currency: "HIVE",
  };
  const [formParams, setFormParams] = useState<{
    data: VscDeposit;
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
        data: {
          ...prevFormParams.data,
          [name]: tempValue,
        },
      }));
    } else {
      if (String(tempValue).trim().length === 0 || !tempValue) {
        const copyState = { ...formParams };
        delete copyState.options;
        setFormParams(copyState);
      } else {
        setFormParams((prevFormParams) => ({
          ...prevFormParams,
          options: {
            ...prevFormParams.options,
            [name]: tempValue,
          },
        }));
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const depositRes = await sdk.vsc.deposit(
        formParams.data,
        formParams.options
      );
      setRequestResult(depositRes);
      console.log({ depositRes });
      const confirmationStatus = await sdk.vsc.awaitConfirmation(
        depositRes.result?.id!
      );
      console.log({ confirmationStatus });
      setRequestResult({ ...depositRes, newStatus: confirmationStatus });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request VSC Deposit</Card.Header>
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
            <InputGroup.Text>Hive or EVM Address (optional)</InputGroup.Text>
            <InputGroup.Text className="normal">#</InputGroup.Text>{" "}
            <Form.Control
              placeholder="Receiver address"
              name="to"
              value={formParams.data.to}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>

            <Form.Control
              placeholder="Amount to send"
              name="amount"
              value={formParams.data.amount}
              onChange={handleFormParams}
            />
            <Form.Select
              onChange={handleFormParams}
              value={formParams.data.currency}
              name="currency"
            >
              <option value="HIVE">HIVE</option>
              <option value="HBD">HBD</option>
            </Form.Select>
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

export default RequestVscDepositComponent;

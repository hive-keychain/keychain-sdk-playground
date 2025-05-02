import { VscOptions, VscStaking, VscStakingOperation } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestVscStakingComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_PARAMS: VscStaking = {
    username: lastUsernameFound,
    to: `hive:${lastUsernameFound}`,
    operation: VscStakingOperation.STAKING,
    amount: "0.001",
    currency: "HBD",
  };
  const [formParams, setFormParams] = useState<{
    data: VscStaking;
    options?: VscOptions;
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
      const stakingRes = await sdk.vsc.staking(
        formParams.data,
        formParams.options
      );
      setRequestResult(stakingRes);
      console.log({ stakingRes });
      const confirmationStatus = await sdk.vsc.awaitConfirmation(stakingRes);
      console.log({ confirmationStatus });
      setRequestResult({ ...stakingRes, newStatus: confirmationStatus });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request VSC Staking/Unstaking</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <Form.Select
              onChange={handleFormParams}
              value={formParams.data.operation}
              name="operation"
            >
              <option value={VscStakingOperation.STAKING}>
                {VscStakingOperation.STAKING}
              </option>
              <option value={VscStakingOperation.UNSTAKING}>
                {VscStakingOperation.UNSTAKING}
              </option>
            </Form.Select>
          </InputGroup>
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
            <InputGroup.Text> Receiver Address</InputGroup.Text>
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
              {/* <option value="HIVE">HIVE</option> */}
              <option value="HBD">HBD</option>
            </Form.Select>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Net ID</InputGroup.Text>
            <Form.Control
              placeholder="VSC Net - optional"
              name="netId"
              value={formParams.options?.netId}
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

export default RequestVscStakingComponent;

import { Swap } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestSwapComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Swap;
    options?: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      startToken: "HIVE",
      endToken: "HBD",
      amount: 1,
      steps: [],
      slippage: 1,
    },
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams, setFormParamsToShow]);
  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    const tempValue =
      undefinedParamsToValidate.findIndex((param) => param === name) !== -1 &&
      value.trim() === ""
        ? undefined
        : ["slippage", "amount"].includes(name)
        ? +value
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
      // const serverStatus = await sdk.swap.getServerStatus();
      // handle cases where the server is stopped, in maintenance, or behind blocks
      const config = await sdk.swap.getConfig();
      // getting swap configs, such as fees and allowed slippage
      const estimation = await sdk.swap.getEstimation(
        formParams.data.amount,
        formParams.data.startToken,
        formParams.data.endToken,
        config
      );
      // get the swap estimation
      const sendToken = await sdk.swap.start(
        {
          ...formParams.data,
          username:
            formParams.data.username === ""
              ? undefined
              : formParams.data.username,
          steps: estimation.steps,
        },
        formParams.options
      );
      setRequestResult(sendToken);
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Swap</Card.Header>
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
            <InputGroup.Text>Start Token</InputGroup.Text>
            <CustomToolTip placement="top" toolTipText={"Start token"}>
              <Form.Control
                placeholder="Start token"
                name="startToken"
                value={formParams.data.startToken}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>End token</InputGroup.Text>
            <CustomToolTip placement="top" toolTipText={"End token"}>
              <Form.Control
                placeholder="End token"
                name="endToken"
                value={formParams.data.endToken}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Amount</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Amount to be swapped. "}
            >
              <Form.Control
                placeholder="Amount to be transfered."
                name="amount"
                as="input"
                type="number"
                value={formParams.data.amount}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Slippage</InputGroup.Text>
            <CustomToolTip placement="top" toolTipText={"Slippage"}>
              <Form.Control
                placeholder="Slippage"
                name="slippage"
                as="input"
                type="number"
                value={formParams.data.slippage}
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

export default RequestSwapComponent;

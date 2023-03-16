import { CreateProposal } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_PARAMS: CreateProposal = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  receiver: localStorage.getItem("last_username") || "keychain.tests",
  subject: "The New proposal title",
  permlink: "proposal-keychain-dev-permlink",
  start: "2023-02-25T00:00:00",
  end: "2024-02-25T00:00:00",
  daily_pay: "390.000 HBD",
  extensions: JSON.stringify([]),
};
const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = ["rpc"];

const RequestCreateProposalComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: CreateProposal;
    options: KeychainOptions;
  }>({
    data: DEFAULT_PARAMS,
    options: DEFAULT_OPTIONS,
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
        options: { ...prevFormParams.options, [name]: tempValue },
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const createProposal = await sdk.createProposal(
        formParams.data,
        formParams.options
      );
      setRequestResult(createProposal);
      console.log({ createProposal });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Create Proposal</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
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
            <InputGroup.Text>Receiver@</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Account receiving the funding if the proposal is voted"
              }
            >
              <Form.Control
                placeholder="receiver's account"
                name="receiver"
                value={formParams.data.receiver}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Subject</InputGroup.Text>
            <CustomToolTip placement="top" toolTipText={"Title of the DAO"}>
              <Form.Control
                placeholder="Title of the DAO"
                name="subject"
                value={formParams.data.subject}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Permlink</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Permlink to the proposal description"}
            >
              <Form.Control
                placeholder="Permlink to the proposal description"
                name="permlink"
                value={formParams.data.permlink}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Start</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Starting date, requires format: YYYY-DD-MMTHH:MM:SS"
              }
            >
              <Form.Control
                placeholder="Starting date i.e: 2023-02-25T00:00:00"
                name="start"
                value={formParams.data.start}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>End</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Ending date, requires format: YYYY-DD-MMTHH:MM:SS"}
            >
              <Form.Control
                placeholder="Ending date i.e: 2024-02-25T00:00:00"
                name="end"
                value={formParams.data.end}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Daily pay</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Daily amount to be received by receiver. Requires 3 decimals, i.e: '100.000 HBD'"
              }
            >
              <Form.Control
                placeholder="Daily amount"
                name="daily_pay"
                value={formParams.data.daily_pay}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Extensions</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Array of extensions i.e: '[1,2]'"}
            >
              <Form.Control
                placeholder="Array of extensions"
                name="extensions"
                value={formParams.data.extensions}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Rpc</InputGroup.Text>
            <Form.Control
              placeholder="Rpc node to broadcast - optional"
              name="rpc"
              value={formParams.options.rpc}
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

export default RequestCreateProposalComponent;

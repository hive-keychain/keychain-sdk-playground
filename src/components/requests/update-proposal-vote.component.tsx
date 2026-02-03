import { UpdateProposalVote } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestUpdateProposalVoteComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: UpdateProposalVote;
    options?: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      proposal_ids: JSON.stringify([0]),
      approve: false,
      extensions: JSON.stringify([]),
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
      if (!formParams.data.username?.length) {
        delete formParams.data.username;
      }
      const updateProposalVote = await sdk.updateProposalVote(
        formParams.data,
        formParams.options
      );
      setRequestResult(updateProposalVote);
      console.log({ updateProposalVote });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Update Proposal Vote</Card.Header>
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
            <InputGroup.Text>Ids</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Array of ids of the proposals to be removed, i.e: '[1,10]'"
              }
            >
              <Form.Control
                placeholder="ids of the proposals"
                name="proposal_ids"
                value={formParams.data.proposal_ids as string}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="d-flex mb-3 align-items-center">
            <InputGroup.Text>Vote</InputGroup.Text>
            <Form.Check
              className="ms-3"
              type="checkbox"
              name="approve"
              value={formParams.data.approve ? "true" : "false"}
              checked={formParams.data.approve}
              onChange={(e) =>
                handleFormParams({
                  target: {
                    value: e.target.checked,
                    name: e.target.name,
                  },
                })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Extensions</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Array of extensions, i.e: '[1,2]'"}
            >
              <Form.Control
                placeholder="Stringified Array of extensions"
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

export default RequestUpdateProposalVoteComponent;

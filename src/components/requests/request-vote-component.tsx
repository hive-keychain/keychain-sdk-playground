import { Vote } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const undefinedParamsToValidate = ["rpc"];

const RequestVoteComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Vote;
    options?: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      permlink: "perm-link-post-sample",
      author: lastUsernameFound,
      weight: 10000,
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
      const vote = await sdk.vote(formParams.data, formParams.options);
      setRequestResult(vote);
      console.log({ vote });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Vote</Card.Header>
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
                placeholder="Hive username to perform the request"
                name="username"
                value={formParams.data.username}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Permlink</InputGroup.Text>
            <Form.Control
              placeholder="Permlink of post"
              name="permlink"
              value={formParams.data.permlink}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Author</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <Form.Control
              placeholder="Author of post"
              name="author"
              value={formParams.data.author}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Weight</InputGroup.Text>
            <Form.Control
              placeholder="between -10,000 (-100%) and 10,000 (100%)"
              name="weight"
              value={formParams.data.weight}
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

export default RequestVoteComponent;

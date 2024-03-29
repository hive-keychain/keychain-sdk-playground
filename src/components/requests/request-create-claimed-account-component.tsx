import { Authority } from "@hiveio/dhive";
import { CreateClaimedAccount } from "keychain-sdk";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_AUTHORITY = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [["STM8eALyQwyb2C4XhXJ7eZfjfjfSeNeeZREaxPcJRApie1uwzzcuF", 1]],
} as Authority;

const undefinedParamsToValidate = ["rpc"];

const RequestCreateClaimedAccountComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_PARAMS: CreateClaimedAccount = {
    username: lastUsernameFound,
    new_account: lastUsernameFound,
    owner: JSON.stringify(DEFAULT_AUTHORITY),
    active: JSON.stringify(DEFAULT_AUTHORITY),
    posting: JSON.stringify(DEFAULT_AUTHORITY),
    memo: "STM8eALyQwyb2C4XhXJ7eZfjfjfSeNeeZREaxPcJRApie1uwzzcuF",
  };
  const [formParams, setFormParams] = useState<{
    data: CreateClaimedAccount;
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
      const createClaimedAccount = await sdk.createClaimedAccount(
        formParams.data,
        formParams.options
      );
      setRequestResult(createClaimedAccount);
      console.log({ createClaimedAccount });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Create Claimed Account</Card.Header>
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
            <InputGroup.Text>New account</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
              toolTipText={fieldToolTipText.newAccount}
            >
              <Form.Control
                placeholder="new Account's name"
                name="new_account"
                value={formParams.data.new_account}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Owner</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"owner authority object(stringifyed)"}
            >
              <Form.Control
                as={"textarea"}
                rows={3}
                placeholder="owner authority"
                name="owner"
                value={formParams.data.owner}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Active</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"active authority object(stringifyed)"}
            >
              <Form.Control
                as={"textarea"}
                rows={3}
                placeholder="active authority"
                name="active"
                value={formParams.data.active}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Posting</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"posting authority object(stringifyed)"}
            >
              <Form.Control
                as={"textarea"}
                rows={3}
                placeholder="posting authority"
                name="posting"
                value={formParams.data.posting}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Memo Public key</InputGroup.Text>
            <CustomToolTip placement="top" toolTipText={"Public memo key"}>
              <Form.Control
                placeholder="public memo key"
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

export default RequestCreateClaimedAccountComponent;

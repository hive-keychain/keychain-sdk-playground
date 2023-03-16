import { Operation, OperationName, VirtualOperationName } from "@hiveio/dhive";
import { KeychainKeyTypes } from "hive-keychain-commons";
import json5 from "json5";
import { Broadcast } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Collapse,
  Container,
  Form,
  InputGroup,
} from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import OperationListComponent from "../common_ui/operation-list-component";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = [""]; //none to check

const RequestBroadcastComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_OPERATION: Operation = [
    "transfer",
    {
      from: lastUsernameFound,
      to: lastUsernameFound,
      amount: "0.001 HIVE",
      memo: "testing keychain SDK - requestBroadcast",
    },
  ];
  const [operation, setOperation] = useState<Operation>(DEFAULT_OPERATION);
  const [arrayOperations, setArrayOperations] = useState<Operation[]>([]);
  const [formParams, setFormParams] = useState<{
    data: Broadcast;
    options: KeychainOptions;
  }>({
    data: {
      username: lastUsernameFound,
      operations: [],
      method: KeychainKeyTypes.active,
    },
    options: DEFAULT_OPTIONS,
  });
  const [editOperationMode, setEditOperationMode] = useState<boolean>(false);
  const [badFormatJSONFlag, setBadFormatJSONFlag] = useState(false);

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  useEffect(() => {
    handleFormParams({
      target: {
        value: arrayOperations,
        name: "operations",
      },
    });
  }, [arrayOperations]);

  const handleResetList = () => {
    setArrayOperations([]);
  };

  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    let tempValue =
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

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const broadcast = await sdk.broadcast(
        formParams.data,
        formParams.options
      );
      setRequestResult(broadcast);
      console.log({ broadcast });
    } catch (error) {
      setRequestResult(error);
    }
  };

  //array operations
  const handleOnChangeOperation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "operation_name") {
      setOperation([
        value as OperationName | VirtualOperationName,
        operation[1],
      ]);
    } else {
      if (String(value).trim() === "") return;
      try {
        const jsonParsed = json5.parse<object>(value);
        console.log({ jsonParsed });
        setOperation([operation[0], jsonParsed]);
        setBadFormatJSONFlag(false);
      } catch (error) {
        setBadFormatJSONFlag(true);
        console.log("Error trying to parse json: ", error);
      }
    }
  };

  const handleAddOperation = () => {
    if (operation[0] && operation["1"]) {
      setArrayOperations((prevArrayOperations) => [
        ...prevArrayOperations,
        operation,
      ]);
    }
  };

  const handleAddEditedOperation = (indexOperation: number) => {
    if (operation[0] && operation["1"]) {
      const copyArrayOperations = [...arrayOperations];
      copyArrayOperations[indexOperation] = operation;
      setArrayOperations(copyArrayOperations);
      setEditOperationMode(false);
      setOperation(DEFAULT_OPERATION);
    }
  };

  const handleRemoveOperation = (itemIndex: number) => {
    const copyArrayOperations = [...arrayOperations];
    copyArrayOperations.splice(itemIndex, 1);
    setArrayOperations(copyArrayOperations);
  };
  //end array operations

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Generic Broadcast</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Username @</InputGroup.Text>
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
          <Form.Group className="mb-3">
            <Form.Label>Operations</Form.Label>

            <Collapse in={!editOperationMode}>
              <Container>
                <Container>
                  <CustomToolTip
                    placement="top"
                    toolTipText={fieldToolTipText.operationType}
                  >
                    <Form.Control
                      placeholder="Operation type"
                      name="operation_name"
                      onChange={handleOnChangeOperation}
                    />
                  </CustomToolTip>
                  <CustomToolTip
                    placement="top"
                    toolTipText={fieldToolTipText.jsonObject}
                  >
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="JSON"
                      name="json"
                      onChange={handleOnChangeOperation}
                    />
                  </CustomToolTip>
                  {badFormatJSONFlag && (
                    <Form.Text muted>Please check JSON format!</Form.Text>
                  )}
                </Container>
                <Container className="d-flex mt-2 mb-2 justify-content-center">
                  <CustomToolTip
                    placement="top"
                    toolTipText={fieldToolTipText.clickToAddOperation}
                  >
                    <Button onClick={handleAddOperation}>+</Button>
                  </CustomToolTip>
                  <CustomToolTip
                    placement="top"
                    toolTipText={fieldToolTipText.resetOperationList}
                  >
                    <Button
                      className="ms-3"
                      onClick={handleResetList}
                      variant="outline-primary"
                    >
                      reset queue list
                    </Button>
                  </CustomToolTip>
                </Container>
              </Container>
            </Collapse>

            {arrayOperations.length > 0 && (
              <Container
                className="d-flex justify-content-center align-content-center"
                fluid
              >
                <OperationListComponent
                  list={arrayOperations}
                  handleRemoveItem={handleRemoveOperation}
                  handleOnChangeOperation={handleOnChangeOperation}
                  handleAddEditedOperation={handleAddEditedOperation}
                  setEditOperationMode={setEditOperationMode}
                  setOperation={setOperation}
                  badFormatJSONFlag={badFormatJSONFlag}
                />
              </Container>
            )}
          </Form.Group>

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

export default RequestBroadcastComponent;

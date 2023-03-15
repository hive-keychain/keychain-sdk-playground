import {
  Client,
  DynamicGlobalProperties,
  Operation,
  OperationName,
  Transaction,
  VirtualOperationName,
} from "@hiveio/dhive";
import { Buffer } from "buffer";
import { KeychainKeyTypes } from "hive-keychain-commons";
import json5 from "json5";
import { SignTx } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_OPERATION: Operation = [
  "transfer",
  {
    from: localStorage.getItem("last_username") || "keychain.tests",
    to: localStorage.getItem("last_username") || "keychain.tests",
    amount: "0.001 HIVE",
    memo: "Testing keychain SDK - requestSignTx & broadcast",
  },
];

const DEFAULT_TX: Transaction = {
  ref_block_num: 1,
  ref_block_prefix: 1,
  expiration: new Date(Date.now() + 600000).toISOString().slice(0, -5),
  operations: [],
  extensions: [],
};

const DEFAULT_PARAMS: SignTx = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  tx: DEFAULT_TX,
  method: KeychainKeyTypes.posting,
};
const DEFAULT_OPTIONS: KeychainOptions = {};

const client = new Client([
  "https://api.hive.blog",
  "https://api.openhive.network",
]);

const undefinedParamsToValidate = [""]; //none to check

const RequestSignTxComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
}: Props & CommonProps) => {
  const [operation, setOperation] = useState<Operation>(DEFAULT_OPERATION);
  const [arrayOperations, setArrayOperations] = useState<Operation[]>([]);
  const [formParams, setFormParams] = useState<{
    data: SignTx;
    options: KeychainOptions;
    broadcastSignedTx: boolean;
  }>({
    data: DEFAULT_PARAMS,
    options: DEFAULT_OPTIONS,
    broadcastSignedTx: false,
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const [dHiveprops, setDHiveProps] = useState<DynamicGlobalProperties>();

  useEffect(() => {
    initProps();
  }, []);

  useEffect(() => {
    console.log({ arrayOperations });
  }, [arrayOperations]);

  useEffect(() => {
    if (dHiveprops) {
      formParams.data.tx.ref_block_num = dHiveprops.head_block_number & 0xffff;
      formParams.data.tx.ref_block_prefix = Buffer.from(
        dHiveprops.head_block_id,
        "hex"
      ).readUInt32LE(4);
    }
  }, [dHiveprops]);

  const initProps = async () => {
    setDHiveProps(await client.database.getDynamicGlobalProperties());
  };

  const handleOperation = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } catch (error) {
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

  useEffect(() => {
    if (arrayOperations) {
      handleFormParams({
        target: {
          value: arrayOperations,
          name: "operations",
        },
      });
    }
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
    } else if (name === "options") {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        options: { ...prevFormParams.options, [name]: tempValue },
      }));
    } else if (name === "operations") {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        data: {
          ...prevFormParams.data,
          tx: { ...prevFormParams.data.tx, operations: tempValue },
        },
      }));
    } else {
      //using just field on signTx as 'broadcastSignedTx'
      setFormParams((prevFormParams) => ({ ...prevFormParams, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const sign = await sdk.signTx(formParams.data, formParams.options);
      let signedTxBroadcast;
      if (formParams.broadcastSignedTx) {
        signedTxBroadcast = await client.broadcast.send(sign.result as any);
      }
      setRequestResult(
        formParams.broadcastSignedTx
          ? { success: true, result: signedTxBroadcast }
          : sign
      );
      console.log(
        formParams.broadcastSignedTx ? { signedTxBroadcast } : { sign }
      );
    } catch (error) {
      setRequestResult(error);
    }
  };
  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Sign Tx</Card.Header>
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
            <Container>
              <CustomToolTip
                placement="top"
                toolTipText={fieldToolTipText.operationType}
              >
                <Form.Control
                  placeholder="Operation type"
                  name="operation_name"
                  onChange={handleOperation}
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
                  onChange={handleOperation}
                />
              </CustomToolTip>
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
            {arrayOperations.length > 0 && (
              <Container>
                <ListGroup>
                  {arrayOperations.map((op, index) => {
                    return (
                      <ListGroup.Item key={`${index}-op-queue`}>
                        On Queue: {op[0]} {op[1].amount ? op[1].amount : ""}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Container>
            )}
          </Form.Group>
          <InputGroup className="mb-3">
            <Form.Select
              onChange={handleFormParams}
              className={"mt-1"}
              value={formParams.data.method}
              name="method"
            >
              <option>Please select a Method</option>
              <option value={KeychainKeyTypes.active}>
                {KeychainKeyTypes.active}
              </option>
              <option value={KeychainKeyTypes.posting}>
                {KeychainKeyTypes.posting}
              </option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="d-flex mb-3 align-items-center">
            <CustomToolTip
              placement="top"
              toolTipText={fieldToolTipText.broadcastAfterSignTx}
            >
              <InputGroup.Text>Broadcast</InputGroup.Text>
            </CustomToolTip>
            <CustomToolTip
              placement="top"
              toolTipText={fieldToolTipText.broadcastAfterSignTx}
            >
              <Form.Check
                className="ms-3"
                type="checkbox"
                name="broadcastSignedTx"
                value={formParams.broadcastSignedTx ? "true" : "false"}
                onChange={(e) =>
                  handleFormParams({
                    target: {
                      value: e.target.checked,
                      name: e.target.name,
                    },
                  })
                }
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

export default RequestSignTxComponent;

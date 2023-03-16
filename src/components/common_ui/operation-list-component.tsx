import { Operation } from "@hiveio/dhive";
import { useState } from "react";
import {
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import CustomButton, { IconName } from "./custom-button";

type Props = {
  list: Operation[];
  handleRemoveItem: (itemIndex: number) => void;
  handleOnChangeOperation: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddEditedOperation: (indexOperation: number) => void;
  setEditOperationMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const OperationListComponent = ({
  list,
  handleRemoveItem,
  handleOnChangeOperation,
  handleAddEditedOperation,
  setEditOperationMode,
}: Props) => {
  const [selectedItemIndexToEdit, setSelectedItemIndexToEdit] =
    useState<number>();

  const handleEnterEditMode = (itemIndex: number) => {
    setEditOperationMode(true);
    setSelectedItemIndexToEdit(itemIndex);
  };

  const handleEditOperation = (itemIndex: number) => {
    handleAddEditedOperation(itemIndex);
    setSelectedItemIndexToEdit(undefined);
  };

  const handleCancelEdit = () => {
    setSelectedItemIndexToEdit(undefined);
    setEditOperationMode(false);
  };

  return (
    <ListGroup className="d-flex w-100 justify-content-center align-content-center">
      {list.map((itemList, index) => {
        return (
          <ListGroup.Item key={`item-list-${index}`}>
            <Container>
              <Row>
                <Col sm={8}>
                  On Queue: {itemList[0]}{" "}
                  {itemList[1].amount ? itemList[1].amount : ""}{" "}
                </Col>
                <Col sm={4} className="d-flex justify-content-center">
                  {selectedItemIndexToEdit !== index && (
                    <CustomButton
                      icon={IconName.EDIT}
                      onClickHandler={() => handleEnterEditMode(index)}
                      toolTipText={"Edit"}
                    />
                  )}
                  {selectedItemIndexToEdit === index && (
                    <CustomButton
                      icon={IconName.SAVE}
                      toolTipText="Save"
                      onClickHandler={() => handleEditOperation(index)}
                    />
                  )}
                  {selectedItemIndexToEdit !== undefined &&
                    selectedItemIndexToEdit === index && (
                      <CustomButton
                        icon={IconName.CANCEL}
                        onClickHandler={() => handleCancelEdit()}
                        toolTipText="Cancel edition"
                      />
                    )}
                  <CustomButton
                    icon={IconName.DELETE}
                    onClickHandler={handleRemoveItem}
                    toolTipText="Delete"
                  />
                </Col>
                {index === selectedItemIndexToEdit && (
                  <Form.Group>
                    <Container>
                      <Row>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>Type</InputGroup.Text>
                          <Form.Control
                            // placeholder="Rpc node to broadcast - optional"
                            // name="rpc"
                            defaultValue={itemList[0]}
                            // value={operation[0]}
                            // onChange={handleFormParams}
                            placeholder="Operation type"
                            name="operation_name"
                            onChange={handleOnChangeOperation}
                          />
                        </InputGroup>
                      </Row>
                      <Row>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>JSON</InputGroup.Text>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Operation JSON"
                            name="json"
                            defaultValue={JSON.stringify(
                              itemList[1],
                              undefined,
                              "     "
                            )}
                            onChange={handleOnChangeOperation}
                          />
                        </InputGroup>
                      </Row>
                    </Container>
                  </Form.Group>
                )}
              </Row>
            </Container>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default OperationListComponent;

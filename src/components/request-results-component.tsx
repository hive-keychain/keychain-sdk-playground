import { useEffect } from "react";
import { Accordion, Card, Container, ListGroup } from "react-bootstrap";
import CustomCloseButton from "./custom-close-button";

type Props = {
  requestResult: any;
  setRequestResult: React.Dispatch<React.SetStateAction<undefined>>;
};

const RequestResultsComponent = ({
  requestResult,
  setRequestResult,
}: Props) => {
  const error =
    typeof requestResult.error === "object"
      ? JSON.stringify(requestResult.error)
      : requestResult.error;

  useEffect(() => {
    console.log({ requestResult });
    if (requestResult && requestResult.data && requestResult.data.username) {
      localStorage.setItem("last_username", requestResult.data.username);
    }
  });

  return (
    <Container className="mt-2 mb-2">
      <Card
        text={
          requestResult.error ||
          (requestResult.error && Object.keys(requestResult.error).length > 0)
            ? "danger"
            : "success"
        }
      >
        <CustomCloseButton
          callBack={() => setRequestResult(undefined)}
          toolTipText={"Reset results"}
        />
        {requestResult.error ? (
          <Card.Body>
            <Card.Text>Error: {error}</Card.Text>
            <Card.Text>Message: {requestResult.message}</Card.Text>
          </Card.Body>
        ) : (
          <Card.Body>
            {requestResult.data && requestResult.data.type && (
              <Card.Title>Request: {requestResult.data.type}</Card.Title>
            )}
            <Card.Subtitle>
              Success: {requestResult.success.toString()}
            </Card.Subtitle>
            <Card.Text>
              Result:{" "}
              {typeof requestResult.result === "object"
                ? JSON.stringify(requestResult.result)
                : requestResult.result.toString()}
            </Card.Text>
            {requestResult.message && (
              <Card.Text>Message: {requestResult.message}</Card.Text>
            )}
            {requestResult.request_id && (
              <Card.Text>Request_id: {requestResult.request_id}</Card.Text>
            )}
            {requestResult.publicKey && (
              <Card.Text>PublicKey: {requestResult.publicKey}</Card.Text>
            )}
            {requestResult.data && (
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Data: {Object.entries(requestResult.data).length.toString()}{" "}
                    field
                    {Object.entries(requestResult.data).length === 0 ? "" : "s"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {Object.entries(requestResult.data).map(
                        (dataItem: any) => {
                          return (
                            <ListGroup.Item key={dataItem[0]}>
                              {dataItem[0]}:{" "}
                              {typeof dataItem[1] === "object"
                                ? JSON.stringify(dataItem[1])
                                : dataItem[1].toString()}
                            </ListGroup.Item>
                          );
                        }
                      )}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

export default RequestResultsComponent;

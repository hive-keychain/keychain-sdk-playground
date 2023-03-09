import { useEffect } from "react";
import { Accordion, Card, Container, ListGroup } from "react-bootstrap";

type Props = {
  requestResult: any;
  enableLogs: boolean;
};

const RequestResultsComponent = ({ requestResult, enableLogs }: Props) => {
  const error =
    typeof requestResult.error === "object"
      ? JSON.stringify(requestResult.error)
      : requestResult.error;

  useEffect(() => {
    if (enableLogs) console.log({ requestResult });
    if (requestResult && requestResult.data && requestResult.data.username) {
      localStorage.setItem("last_username", requestResult.data.username);
    }
  });

  return (
    <Container className="w-50 mt-1">
      <Card
        text={
          requestResult.error ||
          (requestResult.error && Object.keys(requestResult.error).length > 0)
            ? "danger"
            : "success"
        }
      >
        {requestResult.error ? (
          <Card.Body>
            <Card.Text>Error: {error}</Card.Text>
            <Card.Text>Message: {requestResult.message}</Card.Text>
          </Card.Body>
        ) : (
          <Card.Body>
            <Card.Title>Request: {requestResult.data.type}</Card.Title>
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
            <Card.Text>Request_id: {requestResult.request_id}</Card.Text>
            {requestResult.publicKey && (
              <Card.Text>PublicKey: {requestResult.publicKey}</Card.Text>
            )}
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Data: {Object.entries(requestResult.data).length.toString()}{" "}
                  field
                  {Object.entries(requestResult.data).length === 0 ? "" : "s"}
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    {Object.entries(requestResult.data).map((dataItem: any) => {
                      return (
                        <ListGroup.Item key={dataItem[0]}>
                          {dataItem[0]}: {dataItem[1].toString()}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

export default RequestResultsComponent;

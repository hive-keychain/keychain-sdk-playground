import { Badge, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const DefaultCard = () => {
  return (
    <Card
      style={{
        maxWidth: 650,
        margin: "auto",
        padding: 50,
        textAlign: "center",
      }}
    >
      <Card.Title as="h3">Welcome to the Keychain Playground!</Card.Title>
      <br />
      <Card.Text>
        This playground will help getting familiar with the different methods
        available within the Keychain SDK.
      </Card.Text>
      <br />
      <Card.Title as="h4">Get started!</Card.Title>
      <br />
      <Card.Body>
        If you didn't check it yet, please take a look at the installation and
        instanciation process on our{" "}
        <a href="https://github.com/hive-keychain/keychain-sdk">Github</a>.
        <br />
        <br />
        <Card.Title as={"h3"}>Play options:</Card.Title>
        <ListGroup>
          <ListGroup.Item>
            <Card.Subtitle
              as={"h4"}
              className="d-flex flex-row justify-content-center align-items-center"
            >
              <Card.Text as="h6" className="me-1">
                <Badge bg="danger">NEW</Badge>
              </Card.Text>
              <Link to={"swap-widget"}>Keychain Swap Widget</Link>
            </Card.Subtitle>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Subtitle as="h4">Keychain requests</Card.Subtitle>
          </ListGroup.Item>
        </ListGroup>
        <br />
        <Card.Text>
          Done setting up the SDK? Discover the different Keychain requests
          available, in the searchbar above. You will get ready to use examples,
          see the corresponding code, and will be able to see the response
          returned by Keychain. <br />
          <br />
          Have fun BUIDLing!
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DefaultCard;

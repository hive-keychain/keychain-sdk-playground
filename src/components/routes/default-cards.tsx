import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const DefaultCard = () => {
  return (
    <Card className="playground-hero-card">
      <Card.Body>
        <Card.Title as="h3">Welcome to the Keychain Playground!</Card.Title>
        <br />
        <Card.Text>
          This playground will help getting familiar with the different methods
          available within the Keychain SDK.
        </Card.Text>
        <br />
        <Card.Title as="h4">Get started!</Card.Title>
        <br />
        <Card.Text>
          If you didn't check it yet, please take a look at the installation and
          instanciation process on our{" "}
          <a href="https://github.com/hive-keychain/keychain-sdk">Github</a>.
        </Card.Text>
        <br />
        <Card.Title as={"h3"}>Play options:</Card.Title>
        <ListGroup className="playground-list">
          <ListGroup.Item>
            <Card.Subtitle
              as={"h4"}
              className="d-flex flex-row justify-content-center align-items-center"
            >
              <Link to={"swap-widget"}>Keychain Swap Widget</Link>
            </Card.Subtitle>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Subtitle as="h4">
              <Link to={"/?showRequests=true"}>Keychain requests</Link>
            </Card.Subtitle>
          </ListGroup.Item>
        </ListGroup>
        <br />
        <Card.Text>
          Done setting up the SDK? Discover the different Keychain requests
          available, in the searchbar above. You will get ready to use examples,
          see the corresponding code, and will be able to see the response
          returned by Keychain.
        </Card.Text>
        <Card.Text>Have fun BUIDLing!</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DefaultCard;

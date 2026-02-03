import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const DefaultCard = () => {
  return (
    <Card className="playground-hero-card">
      <Card.Body>
        <Card.Title as="h3">Keychain SDK Playground</Card.Title>
        <br />
        <Card.Text>
          Explore Keychain SDK requests with prefilled forms, code samples, and
          live responses.
        </Card.Text>
        <br />
        <Card.Title as="h4">Welcome to the Playground!</Card.Title>
        <br />
        <Card.Text>
          Use the Get started guide for setup, then explore requests and the
          swap widget from the left panel.
        </Card.Text>
        <br />
        <Card.Title as={"h5"}>Sections</Card.Title>
        <ListGroup className="playground-list playground-list-compact">
          <ListGroup.Item>
            <Card.Subtitle
              as={"h5"}
              className="d-flex flex-row justify-content-center align-items-center"
            >
              <Link to={"swap-widget"}>Keychain Swap Widget</Link>
            </Card.Subtitle>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Subtitle as="h5">
              <Link to="/request/get-started">Keychain requests</Link>
            </Card.Subtitle>
          </ListGroup.Item>
        </ListGroup>
        <br />
        <Card.Text>
          Use the left panel to browse request categories. Each request includes
          required inputs, a copy-ready code sample, and the response returned
          by Keychain.
        </Card.Text>
        <Card.Text>Have fun building.</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DefaultCard;

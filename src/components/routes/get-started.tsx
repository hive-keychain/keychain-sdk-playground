import { Card } from "react-bootstrap";

const GetStarted = () => {
  return (
    <Card className="playground-hero-card">
      <Card.Body>
        <Card.Title as="h4">Get started</Card.Title>
        <br />
        <ul className="playground-steps">
          <li>
            <strong>Installation:</strong>
            <br /> Install Keychain SDK.
            <div className="playground-step-code">
              <code>npm install hive-keychain/keychain-sdk</code>
            </div>
          </li>
          <li>
            <strong>Basic usage:</strong>
            <br />
            Create a KeychainSDK instance and call a request.
            <div className="playground-step-code">
              <code>const keychain = new KeychainSDK(window);</code>
            </div>
          </li>
          <li>
            <strong>Basic login:</strong>
            <br /> Start with Login to verify your setup.
            <div className="playground-step-code">
              <code>
                await keychain.login({"{"} username, message, method, title
                {"}"});
              </code>
            </div>
          </li>
        </ul>
        <Card.Text>
          Tip: use the filter in the left panel to jump to a specific request.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default GetStarted;

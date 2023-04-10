import { Card } from "react-bootstrap";

const DefaultCard = () => {
  return (
    <Card
      style={{ width: "40%", margin: "auto", padding: 50, textAlign: "center" }}
    >
      <h3>Welcome to the Keychain Playground!</h3>
      <br />
      <p>
        This playground will help getting familiar with the different methods
        available within the Keychain SDK.
      </p>
      <br />
      <h4>Get started!</h4>
      <br />
      <p>
        If you didn't check it yet, please take a look at the installation and
        instanciation process on our{" "}
        <a href="https://github.com/hive-keychain/keychain-sdk">Github</a>.
        <br />
        <br />
        <h4>Keychain requests</h4>
        <br />
        <p>
          Done setting up the SDK? Discover the different Keychain requests
          available, in the searchbar above. You will get ready to use examples,
          see the corresponding code, and will be able to see the response
          returned by Keychain. <br />
          <br />
          Have fun BUIDLing!
        </p>
      </p>
    </Card>
  );
};

export default DefaultCard;

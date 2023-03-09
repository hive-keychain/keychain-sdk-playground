import { KeychainSDK } from "keychain-sdk";
import { RecurrentTransfer } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { Button, Card, Form } from "react-bootstrap";

type Props = {};

const CodeTester = (props: Props) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //////////////////////
    //copy & paste here///
    try {
      const keychain = new KeychainSDK(window);
      const formParamsAsObject = {
        data: {
          username: "keychain.tests",
          to: "keychain.tests",
          amount: "1.000",
          currency: "HBD",
          memo: "#Encrypted memo sample",
          recurrence: 24,
          executions: 2,
        },
        options: {},
      };
      const recurrenttransfer = await keychain.recurrentTransfer(
        formParamsAsObject.data as RecurrentTransfer,
        formParamsAsObject.options
      );
      console.log({ recurrenttransfer });
    } catch (error) {
      console.log({ error });
    }
    //end copy/paste//////
    //////////////////////
  };

  return (
    <Card className="d-flex justify-content-center mt-3 w-50">
      <Card.Header as={"h5"}>Request COPY/PASTE code tester</Card.Header>
      <Card.Body>
        <Card.Text>
          Instructions: Just copy & Paste the code as shown, within the onSubmit
          handler to test.{" "}
        </Card.Text>
        <Form onSubmit={handleSubmit}>
          <Button variant="primary" type="submit" className="mt-1">
            Execute code sample request!
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CodeTester;

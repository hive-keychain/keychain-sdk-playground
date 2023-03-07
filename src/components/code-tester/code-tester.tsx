import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { KeychainSDK } from 'keychain-sdk';
import { ExcludeCommonParams, RequestSignBuffer } from 'hive-keychain-commons';

type Props = {};

const CodeTester = (props: Props) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //////////////////////
    //copy & paste here///
    try {
      const sdk = new KeychainSDK(window);
      const formParamsAsObject = {"data":{"username":"keychain.tests","message":"#Hi there!","method":"Posting","title":"title"},"options":{}};
      const requestLogin = await sdk.login(formParamsAsObject.data as ExcludeCommonParams<RequestSignBuffer>, formParamsAsObject.options);;
      console.log({ requestLogin });
    } catch (error) {
      console.log({ error });
    }
    //end copy/paste//////
    //////////////////////
  };

  return (
    <Card className="d-flex justify-content-center mt-3 w-50">
      <Card.Header as={'h5'}>Request COPY/PASTE code tester</Card.Header>
      <Card.Body>
        <Card.Text>Instructions: Just copy & Paste the code as shown, within the onSubmit handler to test. </Card.Text>
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

import React, { useEffect, useState } from 'react';
import { KeychainSDK } from 'keychain-sdk';
import { Button, Form, Image, Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/esm/Container';
import KeyChainDetectedIcon from '../assets/images/svgs/check_circle_black.svg';
import KeychainError from '../assets/images/svgs/cancel_black.svg';

type Props = {
  setEnabledKeychain: React.Dispatch<React.SetStateAction<boolean>>;
  enableLogs: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationBarComponent = ({
  setEnabledKeychain,
  enableLogs,
  setModalShow,
}: Props) => {
  const sdk = new KeychainSDK(window);
  const [keychainInstalled, setKeychainInstalled] = useState(false);

  useEffect(() => {
    const onLoadHandler = async () => {
      if (enableLogs) console.log('Fully loaded!');
      try {
        const enabled = await sdk.isKeyChainInstalled();
        setKeychainInstalled(enabled);
        setEnabledKeychain(enabled);
        if (enableLogs) console.log({ KeychainDetected: enabled });
      } catch (error) {
        console.log({ error });
      }
    };

    window.addEventListener('load', onLoadHandler);

    return () => {
      window.removeEventListener('load', onLoadHandler);
    };
  });

  return (
    <Navbar bg="light" expand="lg" className="mb-2">
      <Container fluid>
        <Navbar.Brand
          href="home"
          title={
            keychainInstalled
              ? 'Good to play with requests'
              : 'Install keychain or reload extension on settings.'
          }>
          {keychainInstalled ? 'Keychain Detected' : 'Keychain Not Detected'}
          <Image
            src={keychainInstalled ? KeyChainDetectedIcon : KeychainError}
          />
        </Navbar.Brand>
        <Form className="d-flex" onClick={() => setModalShow(true)} onSubmit={() => {}}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              disabled
            />
            <Button variant="outline-success">Search</Button>
          </Form>
      </Container>
    </Navbar>
  );
};

export default NavigationBarComponent;

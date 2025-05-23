import { KeychainSDK } from "keychain-sdk";
import React, { useEffect, useState } from "react";
import { Button, Form, Image, Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import AlertIconRed from "../assets/images/pngs/icons8-alert-sign.png";
import KeyChainPngIcon from "../assets/images/pngs/keychain_icon_small.png";
import CheckMarkGreen from "../assets/images/svgs/icons8-check-mark-green.svg";
import MouseClickIconSvg from "../assets/images/svgs/mouse_black.svg";
import CustomToolTip from "./common_ui/custom-tool-tip";

type Props = {
  setEnabledKeychain: React.Dispatch<React.SetStateAction<boolean>>;
  enableLogs: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
};

let sdk;

const NavigationBarComponent = ({
  setEnabledKeychain,
  enableLogs,
  setModalShow,
}: Props) => {
  const [keychainInstalled, setKeychainInstalled] = useState(false);
  const [activeBorderOnSearchContainer, setActiveBorderOnSearchContainer] =
    useState(false);

  useEffect(() => {
    const onLoadHandler = async () => {
      if (enableLogs) console.log("Fully loaded!");
      try {
        sdk = new KeychainSDK(window);
        const enabled = await sdk.isKeychainInstalled();
        setKeychainInstalled(enabled);
        setEnabledKeychain(enabled);
        if (enableLogs) console.log({ KeychainDetected: enabled });
      } catch (error) {
        console.log({ error });
      }
    };

    window.addEventListener("load", onLoadHandler);

    return () => {
      window.removeEventListener("load", onLoadHandler);
    };
  });

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="mb-2"
      onMouseEnter={() => setActiveBorderOnSearchContainer(true)}
      onMouseLeave={() => setActiveBorderOnSearchContainer(false)}
    >
      <Container>
        <Navbar.Brand href="home">
          <CustomToolTip
            children={
              <Image
                id="keychain-logo"
                src={KeyChainPngIcon}
                height={30}
                width={30}
                style={{
                  backgroundColor: "black",
                  borderRadius: 50,
                  padding: 3,
                }}
              />
            }
            toolTipText={
              keychainInstalled
                ? "Good to play with requests"
                : "Install keychain or reload extension on settings."
            }
            placement={"bottom"}
          />
          <CustomToolTip
            children={
              <Image
                src={keychainInstalled ? CheckMarkGreen : AlertIconRed}
                height={30}
              />
            }
            toolTipText={
              keychainInstalled
                ? "Keychain extension installed and detected!"
                : "Keychain could not be found, please check documentation, error section."
            }
            placement={"bottom"}
          />
        </Navbar.Brand>
        <Nav
          className={
            activeBorderOnSearchContainer
              ? "m-auto border border-primary rounded border-1"
              : "m-auto"
          }
        >
          <Form
            className="d-flex"
            onClick={() => setModalShow(true)}
            onSubmit={() => {}}
          >
            <CustomToolTip
              placement="bottom"
              toolTipText="Click to show requests list"
            >
              <Form.Control
                type="search"
                placeholder="Request types"
                className="me-2"
                aria-label="Search"
                disabled
              />
            </CustomToolTip>
            <CustomToolTip
              placement="bottom"
              toolTipText="Click to show requests list"
            >
              <Button variant="outline-primary">Search</Button>
            </CustomToolTip>
          </Form>
          {activeBorderOnSearchContainer && <Image src={MouseClickIconSvg} />}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBarComponent;

import { useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AlertIconRed from "../../assets/images/pngs/icons8-alert-sign.png";
import KeyChainPngIcon from "../../assets/images/pngs/keychain_icon_small.png";
import CheckMarkGreen from "../../assets/images/svgs/icons8-check-mark-green.svg";
import { Utils } from "../../utils/utils";
import CustomToolTip from "../common_ui/custom-tool-tip";
import FooterComponent from "../footer.component";
import SearchModal from "../search-modal";

type Props = {};

export default function RootLayout({}: Props) {
  const [keychainInstalled, setKeychainInstalled] = useState(false);
  const [activeBorderOnSearchContainer, setActiveBorderOnSearchContainer] =
    useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [emptyValue, setEmptyValue] = useState("");

  useEffect(() => {
    const onLoadHandler = async () => {
      console.log("Fully loaded!");
      setTimeout(async () => {
        if (document.readyState === "complete") {
          try {
            const enabled = await Utils.getSDK().isKeychainInstalled();
            setKeychainInstalled(enabled);
            console.log({ KeychainDetected: enabled });
          } catch (error) {
            console.log({ error });
          }
        }
      }, 100);
    };

    window.addEventListener("load", onLoadHandler);

    return () => {
      window.removeEventListener("load", onLoadHandler);
    };
  }, []);

  return (
    <div className="App">
      <Navbar
        bg="light"
        expand="lg"
        className="mb-2"
        onMouseEnter={() => setActiveBorderOnSearchContainer(true)}
        onMouseLeave={() => setActiveBorderOnSearchContainer(false)}
      >
        <Container>
          <Navbar.Brand href="/">
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
            />{" "}
            <CustomToolTip
              children={
                <Image
                  src={keychainInstalled ? CheckMarkGreen : AlertIconRed}
                  width={30}
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
                  onClick={() => setModalShow(true)}
                  type="search"
                  placeholder="Request types"
                  className="me-2"
                  aria-label="Search"
                  value={emptyValue}
                  onChange={(e) => setEmptyValue("")}
                />
              </CustomToolTip>
              <CustomToolTip
                placement="bottom"
                toolTipText="Click to show requests list"
              >
                <Button variant="outline-primary">Search</Button>
              </CustomToolTip>
            </Form>
          </Nav>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center mt-2 mb-2">
        <SearchModal show={modalShow} onHide={() => setModalShow(false)} />
      </Container>
      <div id="detail">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
}

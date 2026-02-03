import { useEffect, useState } from "react";
import { Container, Form, Image, Nav, Navbar } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showRequests") === "true") {
      setModalShow(true);
    }
  }, [location.search]);

  const handleModalHide = () => {
    setModalShow(false);
    const params = new URLSearchParams(location.search);
    if (params.has("showRequests")) {
      params.delete("showRequests");
      const search = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: search ? `?${search}` : "",
        },
        { replace: true }
      );
    }
  };

  return (
    <div className="App">
      <Navbar
        bg="light"
        expand="lg"
        className="playground-navbar mb-3"
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
              className="d-flex playground-search"
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
                <span className="playground-search-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </CustomToolTip>
            </Form>
          </Nav>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center mt-2 mb-2">
        <SearchModal show={modalShow} onHide={handleModalHide} />
      </Container>
      <div id="detail" className="playground-detail">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
}

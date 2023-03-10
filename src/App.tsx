import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import FooterComponent from "./components/footer-component";
import NavigationBarComponent from "./components/navigation-bar-component";
import RequestResultsComponent from "./components/request-results-component";
import RequestSelectorComponent from "./components/request-selector-component";
import SearchModal from "./components/search-modal";

type LocalStorageObject = { [key: string]: string };

const localStorageValues: LocalStorageObject = {
  last_username: "keychain.tests",
};

function App() {
  const [enabledKeychain, setEnabledKeychain] = useState(false);
  const [requestResult, setRequestResult] = useState();
  const [enableLogs, setEnableLogs] = useState(true);
  const [modalShow, setModalShow] = useState(true);
  const [request, setRequest] = useState<string>();

  useEffect(() => {
    const lastUsername = localStorage.getItem("last_username");
    if (!lastUsername) {
      Object.entries(localStorageValues).forEach((item) => {
        localStorage.setItem(item[0], item[1]);
      });
    }
  }, []);

  return (
    <div className="App">
      <NavigationBarComponent
        setEnabledKeychain={setEnabledKeychain}
        enableLogs={enableLogs}
        setModalShow={setModalShow}
      />
      <Container className="d-flex justify-content-center mt-2 mb-2">
        <SearchModal
          show={modalShow && enabledKeychain}
          onHide={() => setModalShow(false)}
          setRequest={setRequest}
          setRequestResult={setRequestResult}
        />
      </Container>
      {request !== undefined && (
        <Container>
          {requestResult && (
            <RequestResultsComponent
              requestResult={requestResult}
              enableLogs={enableLogs}
              setRequestResult={setRequestResult}
            />
          )}
          <RequestSelectorComponent
            setRequestResult={setRequestResult}
            requestResult={requestResult}
            enabledKeychain={enabledKeychain}
            enableLogs={enableLogs}
            request={request}
            setRequest={setRequest}
          />
        </Container>
      )}
      <FooterComponent />
    </div>
  );
}

export default App;

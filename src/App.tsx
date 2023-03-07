import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestSelectorComponent from './components/request-selector-component';
import RequestResultsComponent from './components/request-results-component';
import FooterComponent from './components/footer-component';
import LogsEnablerComponent from './components/logs-enabler-component';
import { Button, Card, Container } from 'react-bootstrap';
import SearchModal from './components/search-modal';
import NavigationBarComponent from './components/navigation-bar-component';

function App() {
  const [enabledKeychain, setEnabledKeychain] = useState(false);
  const [requestResult, setRequestResult] = useState();
  const [enableLogs, setEnableLogs] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [request, setRequest] = useState<string>();

  return (
    <div className="App">
      <NavigationBarComponent
        setEnabledKeychain={setEnabledKeychain}
        enableLogs={enableLogs}
        setModalShow={setModalShow}
      />
      <Container className="d-flex justify-content-center mt-2 mb-2">
        <SearchModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          setRequest={setRequest}
        />
      </Container>
      { request !== undefined ?
        <>
        <LogsEnablerComponent
        enableLogs={enableLogs}
        setEnableLogs={setEnableLogs}
      />
      <RequestSelectorComponent
        setRequestResult={setRequestResult}
        requestResult={requestResult}
        enabledKeychain={enabledKeychain}
        enableLogs={enableLogs}
        request={request}
        setRequest={setRequest}
      />
      {requestResult && (
        <RequestResultsComponent
          requestResult={requestResult}
          enableLogs={enableLogs}
        />
      )}
      </>
      :
      <Card className='mt-2 mb-2'>
        <Card.Header as={'h4'} className="text-center">Please click on search, to select a request.</Card.Header>
      </Card>
      }
      <FooterComponent />
    </div>
  );
}

export default App;

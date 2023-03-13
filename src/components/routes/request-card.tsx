import { KeychainRequestTypes } from "hive-keychain-commons";
import { ReactNode, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CopyBlock, solarizedDark } from "react-code-blocks";
import { useParams } from "react-router-dom";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import { Utils } from "../../utils/utils";
import CustomToolTip from "../custom-tool-tip";
import RequestResultsComponent from "../request-results-component";
import RequestAddAccountAuthorityComponent from "../requests/request-add-account-authority-component";
import RequestAddAccountComponent from "../requests/request-add-account-component";
import RequestAddKeyAuthorityComponent from "../requests/request-add-key-authority-component";
import RequestBroadcastComponent from "../requests/request-broadcast-component";
import RequestConversionComponent from "../requests/request-conversion-component";
import RequestCreateClaimedAccountComponent from "../requests/request-create-claimed-account-component";
import RequestCreateProposalComponent from "../requests/request-create-proposal-component";
import RequestCustomJsonComponent from "../requests/request-custom-json-component";
import RequestDelegationComponent from "../requests/request-delegation-component";
import RequestEncodeMessageComponent from "../requests/request-encode-message-component";
import RequestLoginComponent from "../requests/request-login-component";
import RequestPostComponent from "../requests/request-post-component";
import RequestPowerDownComponent from "../requests/request-power-down-component";
import RequestPowerUpComponent from "../requests/request-power-up-component";
import RequestProxyComponent from "../requests/request-proxy-component";
import RequestRecurrentTransferComponent from "../requests/request-recurrent-transfer-component";
import RequestRemoveAccountAuthorityComponent from "../requests/request-remove-account-authority-component";
import RequestRemoveKeyAuthorityComponent from "../requests/request-remove-key-authority-component";
import RequestRemoveProposalComponent from "../requests/request-remove-proposal-component";
import RequestSendTokenComponent from "../requests/request-send-token-component";
import RequestSignBufferComponent from "../requests/request-sign-buffer-component";
import RequestSignTxComponent from "../requests/request-sign-tx-component";
import RequestTransferComponent from "../requests/request-transfer-component";
import RequestUpdateProposalVoteComponent from "../requests/request-update-proposal-vote-component";
import RequestVerifyKeyComponent from "../requests/request-verify-key-component";
import RequestVoteComponent from "../requests/request-vote-component";
import RequestWitnessVoteComponent from "../requests/request-witness-vote-component";

export interface KeychainOptions {
  rpc?: string;
}

export type CommonProps = {
  setFormParamsToShow: React.Dispatch<React.SetStateAction<{}>>;
  setRequestResult: any;
};

type Props = {};

const RequestCard = (props: Props) => {
  let { requestType } = useParams();

  console.log("assigned request: ", { requestType });

  const [requestCard, setRequestCard] = useState<ReactNode>();
  const [requestResult, setRequestResult] = useState();
  const [formParamsToShow, setFormParamsToShow] = useState({});

  const commonProps: CommonProps = {
    setFormParamsToShow,
    setRequestResult,
  };

  useEffect(() => {
    if (!requestType) return;
    switch (requestType) {
      case "login":
        setRequestCard(<RequestLoginComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.encode:
        setRequestCard(<RequestEncodeMessageComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.decode:
        setRequestCard(<RequestVerifyKeyComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.signBuffer:
        setRequestCard(<RequestSignBufferComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.addAccountAuthority:
        setRequestCard(
          <RequestAddAccountAuthorityComponent {...commonProps} />
        );
        break;
      case KeychainRequestTypes.removeAccountAuthority:
        setRequestCard(
          <RequestRemoveAccountAuthorityComponent {...commonProps} />
        );
        break;
      case KeychainRequestTypes.addKeyAuthority:
        setRequestCard(<RequestAddKeyAuthorityComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.removeKeyAuthority:
        setRequestCard(<RequestRemoveKeyAuthorityComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.broadcast:
        setRequestCard(<RequestBroadcastComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.signTx:
        setRequestCard(<RequestSignTxComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.post:
        setRequestCard(<RequestPostComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.vote:
        setRequestCard(<RequestVoteComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.custom:
        setRequestCard(<RequestCustomJsonComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.transfer:
        setRequestCard(<RequestTransferComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.sendToken:
        setRequestCard(<RequestSendTokenComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.delegation:
        setRequestCard(<RequestDelegationComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.witnessVote:
        setRequestCard(<RequestWitnessVoteComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.proxy:
        setRequestCard(<RequestProxyComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.powerUp:
        setRequestCard(<RequestPowerUpComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.powerDown:
        setRequestCard(<RequestPowerDownComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.createClaimedAccount:
        setRequestCard(
          <RequestCreateClaimedAccountComponent {...commonProps} />
        );
        break;
      case KeychainRequestTypes.createProposal:
        setRequestCard(<RequestCreateProposalComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.removeProposal:
        setRequestCard(<RequestRemoveProposalComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.updateProposalVote:
        setRequestCard(<RequestUpdateProposalVoteComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.addAccount:
        setRequestCard(<RequestAddAccountComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.convert:
        setRequestCard(<RequestConversionComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.recurrentTransfer:
        setRequestCard(<RequestRecurrentTransferComponent {...commonProps} />);
        break;
      default:
        setRequestCard(null);
        console.log("trying to set: ", { requestType });
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
    }
  }, [requestType]);

  return requestType ? (
    <Container>
      <Row>
        {requestResult && (
          <RequestResultsComponent
            requestResult={requestResult}
            setRequestResult={setRequestResult}
          />
        )}
      </Row>
      <Row>
        <Col lg={true} className="mb-3">
          <Card className="d-flex justify-content-center">
            <Card.Header as={"h4"}>SDK Playground</Card.Header>
            <Card.Body>
              <Container className="mt-2">
                {requestCard ? requestCard : null}
              </Container>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={true}>
          <CustomToolTip
            placement={"top"}
            toolTipText={fieldToolTipText.codeBlockSample}
          >
            <Card className="d-flex">
              <Card.Header as={"h4"}>Code Sample</Card.Header>
              <Card.Body>
                <CopyBlock
                  text={Utils.fromCodeToText(
                    formParamsToShow,
                    requestType as KeychainRequestTypes
                  )}
                  language={"typescript"}
                  showLineNumbers={false}
                  startingLineNumber={1}
                  wrapLines
                  theme={solarizedDark}
                />
              </Card.Body>
            </Card>
          </CustomToolTip>
        </Col>
      </Row>
      {/* TESTING to test code. Uncomment bellow to use */}
      {/* <CodeTester /> */}
      {/* END testing */}
    </Container>
  ) : null;
};

export default RequestCard;

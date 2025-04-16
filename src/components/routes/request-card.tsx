import { KeychainRequestTypes, KeychainSDK } from "keychain-sdk";
import { ReactNode, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CopyBlock, solarizedDark } from "react-code-blocks";
import { useParams } from "react-router-dom";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import { Utils } from "../../utils/utils";
import CustomToolTip from "../common_ui/custom-tool-tip";
import RequestResultsComponent from "../request-results.component";
import RequestAddAccountAuthorityComponent from "../requests/add-account-authority.component";
import RequestAddAccountComponent from "../requests/add-account.component";
import RequestAddKeyAuthorityComponent from "../requests/add-key-authority.component";
import RequestBroadcastComponent from "../requests/broadcast.component";
import RequestConversionComponent from "../requests/conversion.component";
import RequestCreateClaimedAccountComponent from "../requests/create-claimed-account.component";
import RequestCreateProposalComponent from "../requests/create-proposal.component";
import RequestCustomJsonComponent from "../requests/custom-json.component";
import RequestDelegationComponent from "../requests/delegation.component";
import RequestEncodeMessageComponent from "../requests/encode-message-componen";
import RequestEncodeWithKeysComponent from "../requests/encode-with-key.component";
import RequestLoginComponent from "../requests/login.component";
import RequestPostComponent from "../requests/post.component";
import RequestPowerDownComponent from "../requests/power-down.component";
import RequestPowerUpComponent from "../requests/power-up.component";
import RequestProxyComponent from "../requests/proxy.component";
import RequestRecurrentTransferComponent from "../requests/recurrent-transfer.component";
import RequestRemoveAccountAuthorityComponent from "../requests/remove-account-authority.component";
import RequestRemoveKeyAuthorityComponent from "../requests/remove-key-authority.component";
import RequestRemoveProposalComponent from "../requests/remove-proposal.component";
import RequestSendTokenComponent from "../requests/send-token.component";
import RequestSignBufferComponent from "../requests/sign-buffer.component";
import RequestSignTxComponent from "../requests/sign-tx.component";
import RequestSwapComponent from "../requests/swap.component";
import RequestTransferComponent from "../requests/transfer.component";
import RequestUpdateProposalVoteComponent from "../requests/update-proposal-vote.component";
import RequestVerifyKeyComponent from "../requests/verify-key.component";
import RequestVoteComponent from "../requests/vote.component";
import RequestVscCallContractComponent from "../requests/vsc-call-contract.component";
import RequestVscDepositComponent from "../requests/vsc-deposit.component";
import RequestWitnessVoteComponent from "../requests/witness-vote.component";

export interface KeychainOptions {
  rpc?: string;
}

export type CommonProps = {
  setFormParamsToShow: React.Dispatch<React.SetStateAction<{}>>;
  setRequestResult: any;
  sdk: KeychainSDK;
  lastUsernameFound: string;
};

const sdk = Utils.getSDK();

type Props = {};

const RequestCard = (props: Props) => {
  let { requestType } = useParams();

  const [requestCard, setRequestCard] = useState<ReactNode>();
  const [requestResult, setRequestResult] = useState();
  const [formParamsToShow, setFormParamsToShow] = useState({});
  const lastUsernameFound =
    localStorage.getItem("last_username") || "keychain.tests";

  const commonProps: CommonProps = {
    setFormParamsToShow,
    setRequestResult,
    sdk,
    lastUsernameFound,
  };

  useEffect(() => {
    if (!requestType) return;

    setRequestResult(undefined);

    switch (requestType) {
      case "login":
        setRequestCard(<RequestLoginComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.encode:
        setRequestCard(<RequestEncodeMessageComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.encodeWithKeys:
        setRequestCard(<RequestEncodeWithKeysComponent {...commonProps} />);
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
      case KeychainRequestTypes.swap:
        setRequestCard(<RequestSwapComponent {...commonProps} />);
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
      case KeychainRequestTypes.vscCallContract:
        setRequestCard(<RequestVscCallContractComponent {...commonProps} />);
        break;
      case KeychainRequestTypes.vscDeposit:
        setRequestCard(<RequestVscDepositComponent {...commonProps} />);
        break;
      default:
        setRequestCard(null);
        console.log("trying to set: ", { requestType });
        throw new Response("", {
          status: 404,
          statusText: "Not Found Request, please check",
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

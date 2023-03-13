import { Container, Image, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useRouteError } from "react-router-dom";
import KeyChainPngIcon from "../../assets/images/pngs/keychain_icon_small.png";

type Props = {};

const ErrorPage = (props: Props) => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Container className="d-flex align-items-center justify-content-center text-center min-vh-100">
      <Container>
        <Image
          src={KeyChainPngIcon}
          width={40}
          height={40}
          style={{ backgroundColor: "black", borderRadius: 50, padding: 5 }}
        />
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <LinkContainer to="/">
          <Nav.Link className="text-decoration-underline">
            Back to home
          </Nav.Link>
        </LinkContainer>
      </Container>
    </Container>
  );
};

export default ErrorPage;

import { Container, Image, ListGroup } from "react-bootstrap";
import DiscordLogoSvg from "../assets/images/svgs/discord.svg";
import GitSvg from "../assets/images/svgs/github.svg";
import HiveLogoSvg from "../assets/images/svgs/hive.svg";
import TwitterLogoSvg from "../assets/images/svgs/twitter.svg";

function FooterComponent(): JSX.Element {
  return (
    <Container className="d-flex justify-content-center bottom-0 mt-auto">
      <ListGroup className="d-flex justify-content-center mt-4">
        <ListGroup.Item action href={"https://hive-keychain.com/"}>
          Made with ❤ by Keychain Team
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-center">
          <ListGroup horizontal>
            <ListGroup.Item
              action
              href={"https://github.com/hive-keychain/keychain-sdk"}
              target="_blank"
            >
              <Image src={GitSvg} width={20} />
            </ListGroup.Item>
            <ListGroup.Item
              action
              href={"https://hive.blog/@keychain"}
              target="_blank"
            >
              <Image src={HiveLogoSvg} width={20} />
            </ListGroup.Item>
            <ListGroup.Item
              action
              href={"https://discord.com/invite/E6P6Gjv9MC"}
              target="_blank"
            >
              <Image src={DiscordLogoSvg} width={20} />
            </ListGroup.Item>
            <ListGroup.Item
              action
              href={"https://twitter.com/HiveKeychain"}
              target="_blank"
            >
              <Image src={TwitterLogoSvg} width={20} />
            </ListGroup.Item>
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
}

export default FooterComponent;

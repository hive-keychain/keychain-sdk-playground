import { Button } from "react-bootstrap";

type Props = {
  callBack: () => void;
};

const CustomCloseButton = ({ callBack }: Props) => {
  return (
    <Button
      onClick={() => callBack()}
      variant="link"
      className="position-absolute top-0 end-0 request-results-close"
      aria-label="Reset results"
    >
      ×
    </Button>
  );
};

export default CustomCloseButton;

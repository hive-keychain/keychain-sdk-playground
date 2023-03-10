import { Button, Image } from "react-bootstrap";
import CancelIconSvg from "../assets/images/svgs/cancel_black.svg";
import CustomToolTip from "./custom-tool-tip";

type Props = {
  callBack: () => void;
  toolTipText: string;
};

const CustomCloseButton = ({ callBack, toolTipText }: Props) => {
  return (
    <CustomToolTip placement="right" toolTipText={toolTipText}>
      <Button
        onClick={() => callBack()}
        variant="outline-light"
        className="position-absolute top-0 end-0"
        style={{ width: 30, height: 30, backgroundColor: "none" }}
      >
        <Image
          src={CancelIconSvg}
          height={30}
          width={30}
          className="position-absolute top-0 end-0"
        />
      </Button>
    </CustomToolTip>
  );
};

export default CustomCloseButton;

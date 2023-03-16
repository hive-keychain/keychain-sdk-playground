import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";

type Props = {
  children: JSX.Element;
  toolTipText: string;
  placement: Placement | undefined;
};

const CustomToolTip = ({ children, toolTipText, placement }: Props) => {
  const renderTooltip = (props: any) => (
    <Tooltip {...props}>{toolTipText}</Tooltip>
  );

  return (
    <OverlayTrigger placement={placement} overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
};

export default CustomToolTip;

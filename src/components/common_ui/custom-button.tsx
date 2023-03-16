import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import CancelBlackSVG from "../../assets/images/svgs/cancel_black.svg";
import DeleteBlackSVG from "../../assets/images/svgs/delete_black.svg";
import EditBlackSVG from "../../assets/images/svgs/edit_black.svg";
import SaveBlackSVG from "../../assets/images/svgs/save_black.svg";
import CustomToolTip from "./custom-tool-tip";

export enum IconName {
  EDIT = "EDIT",
  SAVE = "SAVE",
  DELETE = "DELETE",
  CANCEL = "CANCEL",
}

type Props = {
  icon: IconName;
  onClickHandler: any; //TODO add type if needed.
  toolTipText: string;
};

const CustomButton = ({ icon, onClickHandler, toolTipText }: Props) => {
  const [iconSource, setIconSource] = useState<string>("");

  useEffect(() => {
    selectedIconImage();
  }, [icon]);

  const selectedIconImage = () => {
    switch (icon) {
      case IconName.EDIT:
        setIconSource(EditBlackSVG);
        break;
      case IconName.DELETE:
        setIconSource(DeleteBlackSVG);
        break;
      case IconName.SAVE:
        setIconSource(SaveBlackSVG);
        break;
      case IconName.CANCEL:
        setIconSource(CancelBlackSVG);
        break;
      default:
        setIconSource("");
        console.log("Icon name, not found, please check!", { icon });
        break;
    }
  };

  return (
    <CustomToolTip placement="top" toolTipText={toolTipText}>
      <Button variant="outline-primary" size="sm">
        <Image src={iconSource} width={20} onClick={onClickHandler} />
      </Button>
    </CustomToolTip>
  );
};

export default CustomButton;

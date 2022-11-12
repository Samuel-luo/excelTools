import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";

export interface IProps {
  imgUrl: string;
  text: string;
  to: string;
}

const MenuOption: React.FC<IProps> = (props: IProps) => {
  const { imgUrl, text, to } = props;

  return (
    <Link className={styles.option} to={to}>
      <img src={imgUrl} alt="" />
      <span>{text}</span>
    </Link>
  );
};

export default MenuOption;

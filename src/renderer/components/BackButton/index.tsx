import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import back from "~/img/back.png";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <img className={styles.back} src={back} onClick={() => navigate(-1)} />
    </>
  );
};

export default BackButton;

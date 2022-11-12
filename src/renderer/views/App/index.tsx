import React from "react";
import MenuOption from "@/components/MenuOption";
import styles from "./index.module.scss";
import copy from "~/img/copy.png";
import moreFunction from "~/img/more_function.png";

const App: React.FC = () => {
  const getPlaceholderBlock = () => {
    const blocks = [];
    for (let i = 0; i < 10; i++) {
      blocks.push(<i key={i} style={{ width: "220px", height: "auto" }} />);
    }
    return blocks;
  };

  return (
    <>
      <div className={styles.menu}>
        <MenuOption imgUrl={copy} text="比对合并" to="/comparison_copy" />
        <MenuOption imgUrl={moreFunction} text="更多功能" to="" />
        {getPlaceholderBlock()}
      </div>
    </>
  );
};

export default App;

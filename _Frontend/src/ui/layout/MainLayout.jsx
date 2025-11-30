import React from "react";
import styles from "./MainLayout.module.css";
import BottomPannel from "./BottomPannel";
import LogPanel from "../components/LogPannel";
import LeftPannel from "./LeftPannel";
import Gallery from "../components/Gallery";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <LeftPannel/>
      </div>

      <div className={styles.center}>
        <div className={styles}>
          <Gallery/>
        </div>
      </div>

      <div className={styles.bottom}>
        <LogPanel />
      </div>
    </div>
  );
};

export default MainLayout;

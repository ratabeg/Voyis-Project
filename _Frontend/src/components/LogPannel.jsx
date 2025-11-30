import React, { useContext, useEffect, useRef } from "react";
import LogContext from "../context/LogContext";
import styles from './LogPannel.module.css';

const LogPanel = () => {
  const { logs } = useContext(LogContext);
  const logEndRef = useRef(null);
  // Scroll to bottom whenever logs change
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className={styles.logPannel}>
      <h2 className={styles.logTitle}>Logs</h2>
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      {/* Dummy div to scroll into view */}
      <div ref={logEndRef} />
    </div>
  );
};

export default LogPanel;

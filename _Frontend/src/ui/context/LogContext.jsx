import { createContext, useState } from "react";

// Create context
const LogContext = createContext();

// Provider component
export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState(["Starting log..."]);

  const addLog = (message) => {
    message = `[${new Date().toLocaleTimeString()}] ${message}`;
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
};

// Export context
export default LogContext;

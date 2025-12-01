import { useContext, useRef } from "react";
import LogContext from "../../context/LogContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUpload} from  "@fortawesome/free-solid-svg-icons";
const UploadButton = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  //   const { refresh, setRefresh } = useContext(StatusContext);
  const { logs, addLog } = useContext(LogContext);

  // Open file explorer
  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    // console.log("Selected file:", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        // Try to read server error message
        const serverError = await response.text().catch(() => null);
        throw new Error(serverError || "Upload failed");
      }

      const result = await response.json();

      console.log("Upload success:", result);
      addLog(result.message); // success message from server
      console.log(logs);

      //   setRefresh(!refresh); // Trigger refresh in context

      if (onUpload) onUpload(result);
    } catch (err) {
      // console.error("Upload error:", err);

      // Show readable message in log panel
      //   addLog(`Upload failed: Server message, ${err.message}`);
      const error = JSON.parse(err.message);
      addLog(`Upload failed:, ${error.error}`);
    }
  };

  return (
    <>
      <button onClick={openFileExplorer}>
        {" "}
        {/* <FontAwesomeIcon icon={faSquarePlus} />  */}
        <FontAwesomeIcon icon={faUpload} />
        Upload Image
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;


// import { useContext } from "react";
// import LogContext from "../../context/LogContext";

// export default function UploadButton() {
//   const { addLog } = useContext(LogContext);

//   const handleClick = async () => {
//     try {
//       const result = await window.electron.uploadFile();
//       addLog(result.message);
//     } catch (err) {
//       addLog("Upload failed: " + err.message);
//     }
//   };

//   return (
//     <button onClick={handleClick}>
//       Upload Image
//     </button>
//   );
// }

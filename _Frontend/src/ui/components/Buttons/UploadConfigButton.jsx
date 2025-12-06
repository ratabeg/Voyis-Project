import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef } from "react";
import LogContext from "../../context/LogContext";

const UploadConfigButton = () => {
  //   const { refresh, setRefresh } = useContext(StatusContext);
  const { logs, addLog } = useContext(LogContext);
  const fileInputRef = useRef(null);

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
    formData.append("config", file);
    // console.log("Selected file:", file.filename);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/image/upload-config`,
        {
          method: "POST",
          body: formData,
        }
      );
      addLog(response);
      console.log(response);
      if (!response.ok) {
        // Try to read server error message
        const serverError = await response.text().catch(() => null);
        throw new Error(serverError || "Upload failed");
      }

      const result = await response.json();

      console.log("Upload success:", result);
      addLog(result.message); // success message from server
      console.log(logs);
    } catch (err) {
      const error = JSON.parse(err);
      console.log("Upload error:", err);
      addLog(`Upload failed:, ${error.error}`);
    }
  };
  return (
    <>
      {" "}
      {/* <button onClick={openFileExplorer}>
        <FontAwesomeIcon icon={faUpload} />
        Upload folder config
      </button> */}
      <button onClick={openFileExplorer}>
        {" "}
        {/* <FontAwesomeIcon icon={faSquarePlus} />  */}
        <FontAwesomeIcon icon={faUpload} />
        Upload folder config{" "}
      </button>
      {/* Hidden file input */}
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadConfigButton;

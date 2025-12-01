import { useContext } from "react";
import styles from "./MainLayout.module.css";
import ImageContext from "../context/ImageContext";
import UploadButton from "../components/Buttons/UploadButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const LeftPannel = () => {
  return (
    <>
      <UploadButtons />
      <MetaDataPannel />
    </>
  );
};

const UploadButtons = () => {


  return (
    <div className={styles.leftPanelContent}>
      <UploadButton/>
      <button>
        <FontAwesomeIcon icon={faUpload} />
        Upload folder config</button>
    </div>
  );
};

const MetaDataPannel = () => {
  return (
    <div className={styles.leftPanelContent}>
      <MetadataForm />
    </div>
  );
};

const MetadataForm = () => {
  const { metadata } = useContext(ImageContext);

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };
  // Prevent crashing if metadata isn't loaded yet
  if (!metadata) {
    return (
      <div className={styles.metadataContainer}>
        <h2>Image Metadata</h2>
        <p style={{ textAlign: "center", opacity: 0.6 }}>No image selected</p>
      </div>
    );
  }

  return (
    <div className={styles.metadataContainer}>
      <h2>Image Metadata</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.metadataTable}>
          <tbody>
            <tr>
              <th>File Name</th>
              <td>{metadata.filename}</td>
            </tr>

            <tr>
              <th>Original Name</th>
              <td>{metadata.original_name}</td>
            </tr>

            <tr>
              <th>Size</th>
              <td>{formatBytes(metadata.size_bytes)}</td>
            </tr>

            <tr>
              <th>Type</th>
              <td>{metadata.mime_type}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeftPannel;

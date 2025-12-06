import { useContext, useState, useEffect } from "react";
import styles from "./Gallery.module.css";
import ImageContext from "../context/ImageContext";

const FileTypeDropdown = ({ setFilteredImages }) => {
  const [selected, setSelected] = useState("all");
  const { images } = useContext(ImageContext);

  // Whenever selected filter changes, update filtered images
  useEffect(() => {
    const filtered =
      selected === "all"
        ? images
        : images.filter((img) => img.mime_type === selected);

    setFilteredImages(filtered);
  }, [selected, images, setFilteredImages]);

  const options = [
    { label: "All", value: "all" },
    { label: "JPG", value: "image/jpg" },
    { label: "JPEG", value: "image/jpeg" },
    { label: "PNG", value: "image/png" },
    { label: "TIF", value: "image/tif" },
  ];

  return (
    <div className={styles.filterDropdown}>
      <label htmlFor="fileTypeSelect" className={styles.filterLabel}>
        Filter by type:
      </label>
      <select
        id="fileTypeSelect"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={styles.filterSelect}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FileTypeDropdown;

import { useContext, useEffect, useRef, useState } from "react";
import ImageContext from "../context/ImageContext";
import LogContext from "../context/LogContext";
import styles from "./Gallery.module.css";
import FileTypeDropdown from "./FileTypeDropdown";
import SingleImageViewer from "./SingleImageViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Gallery = () => {
  const { addLog } = useContext(LogContext);
  const { setMetadata, images, setImages, filteredImages, setFilteredImages } =
    useContext(ImageContext);
  const firstUpdate = useRef(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const prevCount = useRef(0);
  const [singleImageViewer, setSingleImageViewer] = useState(false); // Forcing rerender
  const [singleImageViewerImage, setSingleImageViewerImage] = useState(null); // Forcing rerender

  // Convert bytes to human-readable string
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  useEffect(() => {
    if (images.length > prevCount.current) {
      const newCount = images.length - prevCount.current;
      const size = images.reduce(
        (sum, image) => sum + (parseInt(image.total_size, 10) || 0),
        0
      );
      addLog(
        `Server fetched ${newCount} new image(s) added. Total: ${
          images.length
        }, Total Size: ${formatBytes(size)}`
      );
    }
    prevCount.current = images.length;
  }, [images]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/images");
        const packet = await res.json();
        setImages(Array.isArray(packet.data) ? packet.data : []);
        // addLog(packet.message || `Fetched ${packet.length} images`);
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setImages([]);
      }
    };

    fetchImages();
    
    const handleServerUpdate = (
      event,
      { added = [], removed = [], updated = [] }
    ) => {
      // ⛔ Prevent duplication on initial load
      // if (firstUpdate.current) {
      //   firstUpdate.current = false;
      //   return;
      // }

      setImages((prev) => {
        let gallery = [...prev];

        // REMOVE
        gallery = gallery.filter(
          (img) => !removed.some((r) => r.id === img.id)
        );

        // UPDATE
        updated.forEach((u) => {
          const idx = gallery.findIndex((img) => img.id === u.id);
          if (idx !== -1) gallery[idx] = u;
        });

        // ADD – only add NEW images
        added.forEach((a) => {
          if (!gallery.some((img) => img.id === a.id)) {
            gallery.push(a);
          }
        });

        return gallery;
      });

      setFilteredImages(images);
      // Logging
      added.forEach((img) =>
        addLog(`Server Added: ${JSON.stringify(img.filename)}`)
      );
      removed.forEach((img) =>
        addLog(`Server Removed: ${JSON.stringify(img.filename)}`)
      );
    };

    window.electronAPI.onServerUpdate(handleServerUpdate);

    return () => window.electronAPI.removeServerUpdate();
  }, []);

  

  const getMetaData = (image) => {
    console.log(image);
    setMetadata(image);
  };

  // Toggle image selection
  const toggleSelect = (img) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
    // addLog(`added image ${JSON.stringify(img)}`)
  };

  const handleBatchExport = async () => {
    if (!selectedImages.length) {
      alert("Please select images first!");
      return;
    }

    const result = await window.electronAPI.batchExport(selectedImages);
    alert(result.message); // Show success/failure
  };


  const pullUpSingleImageViewer = (image) => {
    setSingleImageViewerImage(image);
    setSingleImageViewer((prev) => !prev)
  }
  return (
    <>
      <FileTypeDropdown setFilteredImages={setFilteredImages} />
      <button onClick={handleBatchExport}>Export Selected</button>
      <div className={styles.galleryWrapper}>
        <div className={styles.galleryContainer}>
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className={
                selectedImages.includes(image)
                  ? styles.galleryItemSelected
                  : styles.galleryItem
              }
              onClick={() => getMetaData(image)}
              onMouseDown={() => toggleSelect(image)}
            >
              <img
                style={{ cursor: "pointer" }}
                src={`${import.meta.env.VITE_BASEURL}${image.thumbnail_path}`}
                alt={`img-${index}`}
                onDoubleClick={() => pullUpSingleImageViewer(image)}
              />
            </div>
          ))}
        </div>
        {singleImageViewer && (
          <div className={styles.SingleImageViewerContainer}>
            <span>
              <button
                className={styles.btnClose}
                onClick={() => setSingleImageViewer((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              {/* <button>Generate</button> */}
            </span>
            <SingleImageViewer image={singleImageViewerImage} />
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;

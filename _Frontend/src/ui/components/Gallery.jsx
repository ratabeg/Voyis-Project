import { useContext, useEffect, useRef, useState } from "react";
import ImageContext from "../context/ImageContext";
import LogContext from "../context/LogContext";
import styles from "./Gallery.module.css";
import FileTypeDropdown from "./FileTypeDropdown";

const Gallery = () => {
  const { addLog } = useContext(LogContext);
  const { setMetadata,images, setImages, filteredImages, setFilteredImages } =
    useContext(ImageContext);
  const firstUpdate = useRef(true);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/images");
        const packet = await res.json();
        setImages(Array.isArray(packet.data) ? packet.data : []);
        addLog(packet.message || `Fetched ${packet.length} images`);
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
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }

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

      setFilteredImages(images)
      // Logging
      added.forEach((img) =>
        addLog(`Server Added: ${JSON.stringify(img.filename)}`)
      );
      removed.forEach((img) =>
        addLog(`Server Removed: ${JSON.stringify(img.filename)}`)
      );
      // updated.forEach((img) => addLog(`Updated: ${JSON.stringify(img.filename)}`));
    };

    window.electronAPI.onServerUpdate(handleServerUpdate);

    return () => window.electronAPI.removeServerUpdate();
  }, []);

  // const fetchImages = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BASEURL}/api/images`
  //     );
  //     const data = await response.json();

  //     // Make sure to match the property names returned by your API
  //     const imagesData = data.data || [];
  //     setImages(imagesData);

  //     addLog(data.message || `Fetched ${imagesData.length} images`);
  //   } catch (error) {
  //     console.error("Error fetching images:", error);
  //     addLog("Error fetching images");
  //   }
  // };

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

  return (
    <>
      <FileTypeDropdown setFilteredImages={setFilteredImages} />
      <button onClick={handleBatchExport}>Export Selected</button>
      <div className={styles.galleryContainer}>
        {filteredImages.map((image, index) => (
          <div
            key={index}
            // className={styles.galleryItem}
            className={
              selectedImages.includes(image)
                ? styles.galleryItemSelected
                : styles.galleryItem
            }
            // onClick={() => getMetaData(image)}
            onClick={() => toggleSelect(image)}
          >
            <img
              style={{ cursor: "pointer" }}
              src={`${import.meta.env.VITE_BASEURL}${image.thumbnail_path}`}
              alt={`img-${index}`}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Gallery;

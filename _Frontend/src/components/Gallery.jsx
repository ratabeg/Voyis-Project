import { useContext, useEffect, useState } from "react";
import ImageContext from "../context/ImageContext";
import LogContext from "../context/LogContext";
import styles from "../components/Gallery.module.css";

const Gallery = () => {
  const { addLog } = useContext(LogContext);
  const {metadata, setMetadata} = useContext(ImageContext);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/images`
      );
      const data = await response.json();

      // Make sure to match the property names returned by your API
      const imagesData = data.data || [];
      setImages(imagesData);

      addLog(data.message || `Fetched ${imagesData.length} images`);
    } catch (error) {
      console.error("Error fetching images:", error);
      addLog("Error fetching images");
    }
  };

  const getMetaData = (image) => {
    console.log(image);
    setMetadata(image);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className={styles.galleryContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={styles.galleryItem}
          onClick={() => getMetaData(image)}
        >
          <img
            style={{ cursor: "pointer", maxWidth: "100%" }}
            src={`${import.meta.env.VITE_BASEURL}${image.thumbnail_path}`}
            alt={`img-${index}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;

// export default SingleImageViewer;
import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import styles from "./Gallery.module.css";

const CropImageViewer = ({ image }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imgRef = useRef(null);

  // react-easy-crop gives us pixel-perfect coordinates
  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Generate a new cropped image
  const generateCroppedImage = async () => {
    if (!croppedAreaPixels) {
      alert("Select an area first!");
      return;
    }

    const img = new Image();
    img.src = `${import.meta.env.VITE_BASEURL}${image.original_path}`;

    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const newImageBase64 = canvas.toDataURL("image/png");

    console.log("Cropped Image:", newImageBase64);

    // Optional Electron save
    if (window.electronAPI?.saveCroppedImage) {
      window.electronAPI.saveCroppedImage(newImageBase64, image.filename);
    }
  };

  return (
    <>
      <button className={styles.generateButton} onClick={generateCroppedImage}>
        Generate Cropped Image
      </button>
      <div className={styles.singleViewerWrapper}>
        <div className={styles.cropContainer}>
          <Cropper
            image={`${import.meta.env.VITE_BASEURL}${image.original_path}`}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} /* change if needed */
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={true}
          />
        </div>
      </div>
    </>
  );
};

export default CropImageViewer;

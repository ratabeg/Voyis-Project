import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./Gallery.module.css";
import CropImageViewer from "./CropImageViewer";
import { useState } from "react";

const SingleImageViewer = ({ image }) => {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <>
        <div className={styles.singleViewer}>
          <CropImageViewer image={image} />
          <button
            className={styles.closeButton}
            onClick={() => setEditMode(false)}
          >
            Close Cropper
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.singleViewer}>
        <button
          className={styles.editButton}
          onClick={() => setEditMode(true)}
        >
          Edit Image
        </button>
        <TransformWrapper
          defaultScale={1}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent>
            <img
              src={`${import.meta.env.VITE_BASEURL}${image.original_path}`}
              alt={image.filename}
              style={{ maxWidth: "100%" }}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
};

export default SingleImageViewer;

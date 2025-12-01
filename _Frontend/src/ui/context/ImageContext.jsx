// MetadataContext.js
import React, { createContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(null);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);



  return (
    <ImageContext.Provider value={{ metadata, setMetadata,images,setImages,filteredImages,setFilteredImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
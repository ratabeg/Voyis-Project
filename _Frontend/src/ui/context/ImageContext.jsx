// MetadataContext.js
import React, { createContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(null);

  return (
    <ImageContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
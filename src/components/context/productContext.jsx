import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);


  return (
    <ProductContext.Provider
      value={{
        productForm,
        setProductForm,
        products,
        setProducts,
        previewImages,
        setPreviewImages,
        showModal,
        setShowModal,
        editProduct,
        setEditProduct,
        loading,
        setLoading,
        
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

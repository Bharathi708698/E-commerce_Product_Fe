import React, { useContext, useEffect } from "react";
import "../product.css";
import { ProductContext } from "../../context/productContext";
import { ApiCall, Config } from "../../../utils/Apis";
import { MAX_IMAGES, Products } from "../../../utils/ApiList";

const AddProductModal = () => {
  const {
    productForm,
    setProductForm,
    previewImages,
    setPreviewImages,
    setShowModal,
    editProduct,
    setEditProduct,
    loading,
    setLoading,
  } = useContext(ProductContext);

  const categoryOptions = [
    "Clothing",
    "Electronics",
    "Books",
    "Home",
    "Accessories",
  ];

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (productForm.images.length + files.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const base64Images = await Promise.all(files.map((file) => toBase64(file)));
    setProductForm({
      ...productForm,
      images: [...productForm.images, base64Images],
    });
    setPreviewImages([...previewImages, base64Images]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const method = editProduct ? "put" : "post";
    const url = editProduct ? `${Products}/${editProduct.id}` : Products;
    const payload = {
      name: productForm.name,
      price: productForm.price,
      category: productForm.category,
      imageUrl: productForm.images,
    };

    const config = Config(method, url, payload);
    const { res, status } = await ApiCall(config);

    setLoading(false);

    if (status === 200 || status === 201) {
      setShowModal(false);
      setEditProduct(null);
      window.location.reload();
    } else {
      alert(`${res}`);
    }
  };

  useEffect(() => {
    if (editProduct) {
      setProductForm({
        name: editProduct.name || "",
        price: editProduct.price || "",
        category: editProduct.category || "",
        images: editProduct.imageUrl || [],
      });

      setPreviewImages(editProduct.imageUrl || []);
    } else {
      setProductForm({
        name: "",
        price: "",
        category: "",
        images: [],
      });

      setPreviewImages([]);
    }
  }, [editProduct]);

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...productForm.images];

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setProductForm({ ...productForm, images: updatedImages });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={() => setShowModal(false)}>
          x
        </button>
        <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              maxLength={70}
              id="name"
              name="name"
              value={productForm.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="text"
              id="price"
              name="price"
              maxLength={8}
              value={productForm.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={productForm.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categoryOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={productForm.images.length >= MAX_IMAGES}
            />
          </div>

          {productForm.images.length >= MAX_IMAGES && (
            <p className="warning">Max {MAX_IMAGES} images allowed.</p>
          )}

          <div className="preview">
            {previewImages.map((img, index) => (
              <div key={index} className="preview-wrapper">
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button type="submit">{editProduct ? "Update" : "Submit"}</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

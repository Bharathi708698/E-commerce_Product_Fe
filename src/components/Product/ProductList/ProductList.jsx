import React, { useContext, useEffect } from "react";
import { ProductContext } from "../../context/productContext";
import { Products } from "../../../utils/ApiList";
import { ApiCall, Config } from "../../../utils/Apis";
import AddProductModal from "../AddProduct/AddProduct";

const ProductList = () => {
  const {
    products,
    setProducts,
    showModal,
    setShowModal,
    setProductForm,
    setPreviewImages,
    setEditProduct,
    loading,
    setLoading,
  } = useContext(ProductContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("token", "J_Pencil");
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const config = Config("get", Products);
      const { res, status } = await ApiCall(config);

      if (status === 200) {
        setProducts(res);
      } else if (status === 429) {
        alert(`Too many Request.Please wait for sometimes`);
      } else {
        alert(`${res}`);
      }
    } catch (error) {
      alert("An unexpected error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);

    const config = Config("delete", `${Products}/${id}`);
    const { status } = await ApiCall(config);

    if (status === 200) {
      fetchProducts(); 
    } else {
      alert("Delete failed.");
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images || product.images || [],
    });

    setPreviewImages(product.images || product.images || []);
    setEditProduct(product);
    setShowModal(true);
  };

  return (
    <div>
      <header>
        <button
          className="add-button"
          onClick={() => {
            setProductForm({ name: "", price: "", category: "", images: [] });
            setPreviewImages([]);
            setEditProduct(null);
            setShowModal(true);
          }}
        >
          Add Product
        </button>
      </header>
      <h3>Product List</h3>
      {loading ? (
        <div className="loader-container">
          <div className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
      ) : (
        <div className="product-grid">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <div key={p._id || p.id} className="product-card">
                {Array.isArray(p.imageUrl || p.imageUrl) ? (
                  (p.imageUrl || p.imageUrl).map((img, i) => (
                    <img key={i} src={img} alt={p.name} width="100" />
                  ))
                ) : (
                  <img src={p.imageUrl || p.imageUrl} alt={p.name} width="100" />
                )}
                <p>
                  <strong>{p.name}</strong>
                </p>
                <p>₹{p.price}</p>
                <p>{p.category}</p>
                <div className="card-buttons">
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <h4>No Products Found. Create Your First Product!</h4>
          )}
        </div>
      )}
      {showModal && <AddProductModal />}
    </div>
  );
};

export default ProductList;

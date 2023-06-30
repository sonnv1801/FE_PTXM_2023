import React, { useState } from "react";
import axios from "axios";

const AddCombo = () => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    type: "",
    link: "",
    status: "",
    products: [],
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value === "" ? "" : Number(value);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          name: "",
          productCode: "",
          price: 0,
          oldPrice: 0,
          status: "",
          quantity: 0,
          remainingQuantity: 0,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://phutungxemay.onrender.com/v1/combo/",
        formData
      );
      console.log(response.data); // Combo được tạo thành công
      // Thực hiện các hành động khác sau khi tạo combo thành công

      // Reset form
      setFormData({
        image: "",
        title: "",
        type: "",
        link: "",
        status: "",
        products: [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="type">Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="link">Link:</label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h3>Products:</h3>
        {formData.products.map((product, index) => (
          <div key={index}>
            <h4>Product {index + 1}</h4>
            <div>
              <label htmlFor={`name-${index}`}>Name:</label>
              <input
                type="text"
                id={`name-${index}`}
                value={product.name}
                onChange={(e) =>
                  handleProductChange(index, "name", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor={`productCode-${index}`}>Product Code:</label>
              <input
                type="text"
                id={`productCode-${index}`}
                value={product.productCode}
                onChange={(e) =>
                  handleProductChange(index, "productCode", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor={`price-${index}`}>Price:</label>
              <input
                type="number"
                id={`price-${index}`}
                // value={product.price}
                onChange={(e) =>
                  handleProductChange(index, "price", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label htmlFor={`oldPrice-${index}`}>Old Price:</label>
              <input
                type="number"
                id={`oldPrice-${index}`}
                // value={product.oldPrice}
                onChange={(e) =>
                  handleProductChange(index, "oldPrice", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label htmlFor={`status-${index}`}>Status:</label>
              <input
                type="text"
                id={`status-${index}`}
                value={product.status}
                onChange={(e) =>
                  handleProductChange(index, "status", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor={`quantity-${index}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${index}`}
                // value={product.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label htmlFor={`remainingQuantity-${index}`}>
                Remaining Quantity:
              </label>
              <input
                type="number"
                id={`remainingQuantity-${index}`}
                // value={product.remainingQuantity}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "remainingQuantity",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
      <button type="submit">Create Combo</button>
    </form>
  );
};

export default AddCombo;

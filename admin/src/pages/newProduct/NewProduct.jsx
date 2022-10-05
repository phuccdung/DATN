import "./newProduct.css";
import {BASE_URL} from "../../requestMethods";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import axios from "axios";

export default function NewProduct() {
  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="file" />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input type="text" placeholder="Title of new product" />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input type="text" placeholder="Description..." />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input type="text" placeholder="Price" />
        </div>
        <div className="addProductItem">
          <label>In Stock</label>
          <input type="text" placeholder="123" />
        </div>
        <div className="addProductItem">
          <label>Status</label>
          <select name="active" id="active">
              <option value="waiting" >Waiting</option>
              <option value="sale" >Sale</option>
              <option value="cancel" >Cancel</option>
              <option value="pause" >Pause</option>
          </select>
        </div>
        <button className="addProductButton">Create</button>
      </form>
    </div>
  );
}

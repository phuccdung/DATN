import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { productRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {BASE_URL} from "../../requestMethods";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import axios from "axios";


export default function ProductList() {
  const admin=useSelector(selectCurrentUser);

  const [data, setData] = useState([]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  useEffect(()=>{
    const getUsers=async()=>{
      try{
        const res=await axios.get(BASE_URL+"products/?waiting=true",{
          headers: {

            Authorization: "Bearer " + admin.accessToken
  
          },
        });
        setData(res.data);
        console.log(res.data)
      }catch(err){
        console.log(err);
      }
    }
    getUsers();
  },[])

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "title",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "stock", headerName: "Stock", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "price",
      headerName: "Price",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        getRowId={(row)=>row._id}
        checkboxSelection
      />
    </div>
  );
}

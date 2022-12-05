import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getProduct,deleteProductById } from "../../redux/apiCall";


export default function ProductList() {
  const admin=useSelector(selectCurrentUser);
  const [searchKey,setSearchKey]=useState("");
  const [filterData,setFilterData]=useState([]);


  const [data, setData] = useState([]);

  const handleDelete =async (id) => {
    const deleteProduct=async()=>{
      const res= await deleteProductById(id,admin);
      if(res){
        let arr=data.filter((item)=>{return item._id!==id});
        setData(arr);
      }
    }
    deleteProduct();

  };
  useEffect(()=>{
    const getData=async()=>{
      const res= await getProduct("admin");
      console.log(res);
      setData(res);
      setFilterData(res)
    }
    getData();
    
  },[])

  const handleFilter=(e)=>{
    let filter = e.currentTarget.value;
    // console.log(filter);
    if(filter){
      const dataResult=data.filter(item=>item.status===filter)
      setFilterData(dataResult);
    }else{
      setFilterData(data);
    }
  }
  const changeSearch=(e)=>{
    setSearchKey(e.currentTarget.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch=()=>{
    let search = searchKey ;

    if(search){
      const dataResult=data.filter(item=>{
        if(item.title.toLowerCase().includes(search.toLowerCase())||
          item.category.toLowerCase().includes(search.toLowerCase())||
          item.name.toLowerCase().includes(search.toLowerCase())
        ){
          return item
        }
        return;
      });
      setFilterData(dataResult);
    }else{
      setFilterData(data);
    }
  }

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Vendor", width: 150 },
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
    { field: "category", headerName: "Category", width: 150 },
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
              <button className="productListEdit">Detail</button>
            </Link>
            {/* <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <div className="top_page">
        <div className="search_box">
          <input type="text" placeholder="Search....." onKeyDown={e=>handleKeyDown(e)} onChange={(e)=>changeSearch(e)}/>
          <span onClick={handleSearch}>Search</span>
        </div>
        <div className="status_product">
          <select onChange={(e)=>handleFilter(e)}>
            <option  value="" >Choose Status</option>
            <option  value="waiting" >Waiting</option>
            <option  value="sale" >Sale</option>
            <option  value="cancel" >Cancel</option>
            <option  value="pause" >Pause</option>
          </select>
        </div>
      </div>
      <DataGrid
        rows={filterData}
        disableSelectionOnClick
        columns={columns}
        pageSize={20}
        getRowId={(row)=>row._id}
        checkboxSelection
      />
    </div>
  );
}

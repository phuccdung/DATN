import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getUser,getOrder } from "../../redux/apiCall";
import Moment from 'moment';

export default function OrderList() {
  const [data, setData] = useState([]);
  const admin=useSelector(selectCurrentUser);
  const [filterData,setFilterData]=useState([]);
  const [searchKey,setSearchKey]=useState("");
  const fromDate=Moment().startOf("day").format();
  const toDate=Moment().endOf("day").format();


  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  useEffect(()=>{
    const getData=async()=>{
      const res=await getOrder(admin,fromDate,toDate,false);
      if(res?.message){
        console.log(res.data);
        setData(res.data);
        setFilterData(res.data);
      }
    }
    getData()
    
  },[]);


  const handleFilter=(e)=>{
    let filter = e.currentTarget.value;
    console.log(filter);
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
        if(item.vendorName.toLowerCase().includes(search.toLowerCase())||
          item._id.toLowerCase().includes(search.toLowerCase())
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
    {
      field: "name",
      headerName: "Customer",
      width: 200,
      
    },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "phone",
      headerName: "Phone",
      width: 120,
    },
    {
      field: "vendorName",
      headerName: "Vendor",
      width: 150,
    },
    {
      field: "total",
      headerName: "Total",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">View</button>
            </Link>
            {/* <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <div className="top_page">
        <div className="search_box">
          <input type="text" placeholder="Search....." onKeyDown={e=>handleKeyDown(e)} onChange={(e)=>changeSearch(e)}/>
          <span onClick={handleSearch}>Search</span>
        </div>
        <div className="status_product">
          <select onChange={(e)=>handleFilter(e)} >
            <option  value="" >All </option>
            <option  value="Pending" >Pending </option>
            <option  value="Accept" >Accept </option>
            <option  value="Delivering" >Delivering</option>
            <option value="Delivered" >Delivered </option>
            <option  value="Cancelled" >Cancelled </option>

          </select>
        </div>
      </div>
      <DataGrid
        rows={filterData}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
        getRowId={(row)=>row._id}
        checkboxSelection
      />
    </div>
  );
}

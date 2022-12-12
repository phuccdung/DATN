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
  const [status,setStatus]=useState("")
  const [fromDate,setFromDate]=useState(Moment().startOf("day").subtract(3,"day").format("YYYY-MM-DD"));
  const [toDate,setToDate]=useState(Moment().endOf("day").format("YYYY-MM-DD"));


  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  useEffect(()=>{
    const getData=async()=>{
      const res=await getOrder(admin,Moment(fromDate).startOf("date").toString(),Moment(toDate).endOf("date").toString(),false);
      if(res?.message){
        setData(res.data);
        setFilterData(res.data);
      }
    }
    getData()
    
  },[fromDate,toDate]);


  const handleFilter=(e)=>{
    let filter = e.currentTarget.value;
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
      field: "isPay",
      headerName: "Payment to Vendor",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row._id}>
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
    <div className="OrderList">
      <div className="top_page">
        <div className="search_box">
          <input type="text" placeholder="Search....." onKeyDown={e=>handleKeyDown(e)} onChange={(e)=>changeSearch(e)}/>
          <span onClick={handleSearch}>Search</span>
        </div>
        <div className="inputDate">
          <input type="date"
                 value={fromDate}
                 onChange={e=>setFromDate(e.currentTarget.value)} />
          <input type="date"
                 value={toDate}
                 onChange={e=>setToDate(e.currentTarget.value)} />
        </div>
        <div className="status_product">
          <select onChange={(e)=>handleFilter(e)} >
            <option selected={status===""} value="" >All </option>
            <option selected={status==="Pending"} value="Pending" >Pending </option>
            <option selected={status==="Accept"} value="Accept" >Accept </option>
            <option selected={status==="Delivering"} value="Delivering" >Delivering</option>
            <option selected={status==="Delivered"} value="Delivered" >Delivered </option>
            <option selected={status==="Cancelled"} value="Cancelled" >Cancelled </option>

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

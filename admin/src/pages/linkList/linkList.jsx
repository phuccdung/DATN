import "./linkList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getHistoryWithDate } from "../../redux/apiCall";
import Moment from 'moment';

export default function History() {
  const [data, setData] = useState([]);
  const admin=useSelector(selectCurrentUser);
  const [filterData,setFilterData]=useState([]);
  const [searchKey,setSearchKey]=useState("");
  const [fromDate,setFromDate]=useState(Moment().startOf('month').subtract(1,"month").format("YYYY-MM-DD"));
  const [toDate,setToDate]=useState(Moment().endOf("day").format("YYYY-MM-DD"));


  useEffect(()=>{
    const getData=async()=>{
      const res=await getHistoryWithDate(admin,Moment(fromDate).startOf("date").toString(),Moment(toDate).endOf("date").toString());
      if(res?.message){
        setData(res.data);
        setFilterData(res.data);
       console.log(res)
      }
    }
    getData()
    
  },[fromDate,toDate]);


 
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
        if(item.productName.toLowerCase().includes(search.toLowerCase())||
          item._id.toLowerCase().includes(search.toLowerCase())||
          item.linkId.toLowerCase().includes(search.toLowerCase())
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
    { field: "_id", headerName: "ID", width: 100 },
    {
      field: "linkId",
      headerName: "Link ID",
      width: 150,
      
    },
    {
      field: "orderId",
      headerName: "Order ID",
      width: 150,
      
    },
    {
      field: "date",
      headerName: "Date",
      width: 170,
      renderCell: (params) => {
        return (
          <span>{Moment(params.row.date).format("LLL")} </span>
        );
      },
    },
    {
      field: "productName",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.productImg} alt="" />
            {params.row.productName}
          </div>
        );
      },
    },
    
    {
      field: "price",
      headerName: "Price",
      width: 120,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
    },
    {
      field: "discount",
      headerName: "Discount",
      width: 150,
      renderCell: (params) => {
        return (
          <span>{params.row.discount} %</span>
        );
      },
    },
    {
      field: "productImg",
      headerName: "Total",
      width: 150,
      renderCell: (params) => {
        return (
          <span>{Number(params.row.price*params.row.quantity*params.row.discount/100).toFixed(1)} </span>
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
        
      </div>
      <DataGrid
        rows={filterData}
        disableSelectionOnClick
        columns={columns}
        pageSize={15}
        getRowId={(row)=>row._id}
        checkboxSelection
      />
    </div>
  );
}

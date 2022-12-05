import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getUser } from "../../redux/apiCall";

export default function UserList() {
  const [data, setData] = useState([]);
  const admin=useSelector(selectCurrentUser);
  const [filterData,setFilterData]=useState([]);
  const [searchKey,setSearchKey]=useState("");


  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  useEffect(()=>{
    const getData=async()=>{
      const res= await getUser("",admin);
      setData(res);
      setFilterData(res);
      // console.log(res)
    }
    getData();
    
  },[]);


  const handleFilter=(e)=>{
    let filter = e.currentTarget.value;
    console.log(filter);
    if(filter==="c"){
      const dataResult=data.filter(item=>{
        if(!item.roles?.Editor){
          return item;
        }
        return;
      })
      setFilterData(dataResult);
    }else{
      if(filter==="v"){
        const dataResult=data.filter(item=>{
          if(item.roles?.Editor){
            return item;
          }
          return;
        })
        setFilterData(dataResult);
      }else{

        setFilterData(data);
      }
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
        if(item.name.toLowerCase().includes(search.toLowerCase())||
          item.username.toLowerCase().includes(search.toLowerCase())||
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
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.img||"https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} alt="" />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "username", headerName: "Email", width: 200 },
    {
      field: "roles",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return <>
          {
            params.row.roles?.Editor===1984?
            <span>Vendor</span>
            :
            <span>Customer</span>
          }

        </>
      },
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
            <option  value="" >Choose Status</option>
            <option  value="v" >Vendor</option>
            <option  value="c" >Customer</option>

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

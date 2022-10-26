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


  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  useEffect(()=>{
    const getData=async()=>{
      const res= await getUser("",admin);
      setData(res)
    }
    getData();
    
  },[])
  
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
              <button className="userListEdit">Edit</button>
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

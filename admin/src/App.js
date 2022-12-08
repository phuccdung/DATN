import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import OrderList from "./pages/orderList/orderList";
import Order from"./pages/order/order"
import Login from "./pages/login/login";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./redux/userRedux"
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications'



function App() {
  const admin=useSelector(selectCurrentUser);
  return (
    <Router>
        <Switch>
          <Route path="/login">
            <NotificationContainer/>
            <Login />
          </Route>
          {admin? <>
             <NotificationContainer/>
            <Topbar /> 
          <div className="container">
            <Sidebar />
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/users">
              <UserList />
            </Route>
            <Route path="/user/:userId">
              <User />
            </Route>
            <Route path="/newUser">
              <NewUser />
            </Route>
            <Route path="/orders">
              <OrderList />
            </Route>
            <Route path="/order/:orderId">
              <Order />
            </Route>
            <Route path="/products">
              <ProductList />
            </Route>
            <Route path="/product/:productId">
              <Product />
            </Route>
            <Route path="/newproduct">
              <NewProduct />
            </Route>
          </div>
          </>:null}
          
      </Switch>    
    </Router>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';


import App from "./App";
import {BrowserRouter} from"react-router-dom";
import {store,persistor} from "./redux/store";
import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading="null" persistor={persistor}>
        <NotificationContainer/>
        <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

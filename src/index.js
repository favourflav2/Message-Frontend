import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StyledEngineProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 567539344291-eikojo2gm5tiqrm39jjn70mmlqr93u68.apps.googleusercontent.com

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="567539344291-eikojo2gm5tiqrm39jjn70mmlqr93u68.apps.googleusercontent.com">
    <React.StrictMode>
      <ToastContainer />
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <App />
          </Provider>
        </StyledEngineProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./services/context/auth";
import reportWebVitals from "./reportWebVitals";
import { LocationProvider } from "./services/context/location";
import { PartnersProvider } from "./services/context/partners";
import { CompanyProvider } from "./services/context/company";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LocationProvider>
      <PartnersProvider>
        <CompanyProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CompanyProvider>
      </PartnersProvider>
    </LocationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

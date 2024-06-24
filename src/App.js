import { Routes, Route } from "react-router-dom";
import "./App.css";
import Auth from "./views/authentication/Auth";
import AdminReg from "./views/admin/AdminReg";
import Dashboard from "./views/dashboard/Dashboard";
import BaseUI from "./components/BaseUI";
import Manifest from "./views/manifest/upload/Manifest";
import { isAdminLoggedIn, isEmployeeLoggedIn } from "./ApiUrlAndToken";
import Users from "./views/users/Users";
import "./views/tokenHandler/TokenRefresh";
import Bill from "./views/manifest/bill/generate/Bill";
import Location from "./views/location/Location";
import Manage from "./views/manifest/manage/Manage";
import FilterAndSeeBills from "./views/manifest/bill/filterAndSeeBills/FilterAndSeeBills";
import Customers from "./views/customer/Customers";
import HandleAdmin from "./views/admin/HandleAdmin";

function App() {
  return (
    <div className="bg-[#eef0f1] text-black min-h-screen">
      <BaseUI>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/scs-express-add-admin" element={<AdminReg />} />
          {isAdminLoggedIn && (
            <Route path="/scs-express-handle-admin" element={<HandleAdmin />} />
          )}

          {(isAdminLoggedIn || isEmployeeLoggedIn) && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload-manifest" element={<Manifest />} />
              <Route path="/manage-manifest" element={<Manage />} />
              <Route
                path="/manage-manifest/bill-generate/:name/:id"
                element={<Bill />}
              />
              <Route path="/see-bills" element={<FilterAndSeeBills />} />
              <Route path="/location-cost" element={<Location />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customers" element={<Customers />} />
            </>
          )}
        </Routes>
      </BaseUI>
    </div>
  );
}

export default App;

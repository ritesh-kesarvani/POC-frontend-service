import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import { useAuth } from "../../authGuard/AuthGuard";
import { useEffect, useState } from "react";
import ApiLoader from "../../components/apiLoader/ApiLoader";

function Layout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  let auth = useAuth();

  function getUserProfileData() {
    setLoading(true);
    coreService
      .get("mysetting/user")
      .then((response) => {
        auth.setUser(response.data);
        localStorage.setItem("$u$er", JSON.stringify(response.data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toastrService.error(error?.response?.data?.error);
      });
  }

  useEffect(() => {
    getUserProfileData();
  }, []);

  function toggleSideBar(){
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className={`d-flex main ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-container" >
          <Sidebar toggleSideBar={toggleSideBar} />
        </div>
        <div className="layout-container">
          <Header toggleSideBar={toggleSideBar} />
          <div className="px-24">
            <Outlet />
          </div>
        </div>
      </div>
      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default Layout;

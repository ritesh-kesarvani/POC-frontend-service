import { NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../authGuard/AuthGuard";
import { useNavigate } from "react-router-dom";
import { Dropdown, MenuProps, Space } from "antd";

function Header(props: any) {
  const auth = useAuth();
  let navigate = useNavigate();
  function logOut() {
    localStorage.removeItem("$pay$heet");
    localStorage.removeItem("$pay$heet-!d");
    localStorage.removeItem("$u$er");
    auth.setToLocal(null, null);
    navigate("/auth/login");
  }

  const items: MenuProps["items"] = [
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="14"
            viewBox="0 0 448 512"
          >
            <path
              fill="#a2a9b4"
              d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
            ></path>
          </svg>
          <NavLink to="/user/profile">Profile</NavLink>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 0 512 512"
          >
            <path
              fill="#a2a9b4"
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
            ></path>
          </svg>
          <a onClick={logOut}>Logout</a>
        </div>
      ),
      key: "3",
    },
  ];

  return (
    <>
      <div className="header">
        <img
          src="/assets/images/menu-bars.svg"
          alt="menu-bars"
          height="20"
          width="20"
          className="me-2 d-md-none c-pointer"
          onClick={props.toggleSideBar}
        />
        <div className="d-flex align-items-center user ms-auto">
          <div className="notification c-pointer">
            <img
              src="/assets/images/notification-icon.svg"
              alt="notification-icon"
            />
          </div>
          <div className="ver-divider"></div>
          <div className="d-flex align-items-center gap-10">
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Space className="c-pointer">
                <div>
                  <h6 className="user-name m-0">
                    {auth?.userData?.first_name || ""}{" "}
                    {auth?.userData?.last_name || ""}
                  </h6>
                  <h6 className="user-designation m-0">
                    {auth?.userData?.role?.name || ""}
                  </h6>
                </div>
                {/* <img
                  className="user-profile"
                  src="/assets/images/user-profile.png"
                  alt="user-profile"
                /> */}
                <span className="user-profile">
                  {auth?.userData?.first_name?.charAt(0)}
                </span>
                <img
                  className="c-pointer"
                  src="/assets/images/arrow-down.svg"
                  alt="arrow-down"
                />
              </Space>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

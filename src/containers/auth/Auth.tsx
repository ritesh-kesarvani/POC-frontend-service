import "./Auth.css";
import { Outlet } from "react-router-dom";

const Auth: React.FC = () => {
  return (
    <>
      <div className="mx-auto vh-100">
        <div className="d-flex h-100">
          <div className="image-side">
            <img
              className="auth-img w-100 vh-100"
              src="/assets/images/login-image.jpg"
              alt="Auth Image"
            />
          </div>
          <div className="content-side relative">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

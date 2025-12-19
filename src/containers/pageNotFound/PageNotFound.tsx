import "./PageNotFound.css"
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <div className="page-not-found">
        <img src="/assets/images/404-not-found.svg" alt="svg" />
        <div className="text-center">
          <NavLink to="/home" className="btn-primary">Back to Home</NavLink>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;

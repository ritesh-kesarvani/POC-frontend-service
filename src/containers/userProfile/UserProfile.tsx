import { useAuth } from "../../authGuard/AuthGuard";
import "./UserProfile.css";

const Profile = () => {
  let auth = useAuth();

  return (
    <>
      <div className="head d-flex justify-content-between">
        <h1 className="m-0">Profile</h1>
      </div>
      <div className="panel-body inf-content">
        <div className="row">
          <div className="col-md-4 col-lg-2 m-auto d-flex">
            <div className="user-icon m-auto">
              {auth?.userData?.first_name?.charAt(0)}
            </div>
          </div>
          <div className="col-md-6 col-lg-10 m-auto">
            <div className="table-responsive">
              <table className="table table-user-information">
                <tbody>
                  <tr>
                    <td>
                      <strong>
                        <span className="glyphicon glyphicon-user text-primary"></span>
                        Name
                      </strong>
                    </td>
                    <td className="text-color">
                      {auth?.userData?.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>
                        <span className="glyphicon glyphicon-cloud text-primary"></span>
                        Email
                      </strong>
                    </td>
                    <td className="text-color">{auth?.userData?.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>
                        <span className="glyphicon glyphicon-envelope text-primary"></span>
                        Role
                      </strong>
                    </td>
                    <td className="text-color">{auth?.userData?.designation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

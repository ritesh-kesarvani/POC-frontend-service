import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../../authGuard/AuthGuard";
import { SubmitHandler, useForm } from "react-hook-form";
import * as coreService from "../../../services/coreService";
import * as toastrService from "../../../services/toastrService";
import ApiLoader from "../../../components/apiLoader/ApiLoader";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
type FormValues = {
  email: string;
  password: string;
};

function Login() {
  let auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  function togglePass() {
    setShowPassword(!showPassword);
  }
  // const [searchParams, setSearchParams] = useSearchParams();

  // const returnUrl = searchParams.get("returnUrl") || "/";

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.email || !data.password) {
      return;
    }

    setLoading(true);
    coreService
      .post("auth/login", data)
      .then((res: any) => {
        setLoading(false);
        auth.setToLocal(res?.data?.access_token, res?.data?.data?.tenant_id);
        auth.setUser(res?.data?.data);
        // localStorage.setItem("$u$er", JSON.stringify(res?.data?.data));
        navigate("/home", { replace: true });
      })
      .catch((err: any) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.message);
      });
  };

  return (
    <>
      <form
        autoComplete="off"
        className="auth-form d-grid align-items-center h-100 p-3 p-sm-4 p-xl-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="w-100">
          <h2 className="gilroy-bold">Sign In</h2>
          <p className="gilroy-medium">Please Enter Your Email And Password</p>
          <div className="relative py-1">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              className={`w-100 p-2 mt-1 form-control ${
                errors.email ? "error" : ""
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="required-error">Email is required</span>
            )}
          </div>
          <div className="relative py-1">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              {...register("password", { required: true })}
              type={!showPassword ? "password" : "text"}
              className={`w-100 p-2 mt-1 form-control ${
                errors.password ? "error" : ""
              }`}
              placeholder="Password"
            />
            <span className="pass-eye" onClick={togglePass}>
              <img
                src={
                  showPassword
                    ? "/assets/images/eye.svg"
                    : "/assets/images/eye-slash.svg"
                }
                alt="eye"
              />
            </span>
            {errors.password && (
              <span className="required-error">Password is required</span>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <NavLink className="forgot-pass" to={"/auth/forgot-password"}>
                Forgot password?
              </NavLink>
            </div>
          </div>
          <button
            disabled={loading}
            className="btn btn-primary w-100 Gilroy-medium"
            type="submit"
          >
            Sign In
          </button>
          <div className="sign-up mt-3 text-center">
            If you don’t have an account.
            <NavLink to={"/auth/sign-up"}> Create Account</NavLink>
          </div>
        </div>
        {/* </div> */}
      </form>
      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default Login;

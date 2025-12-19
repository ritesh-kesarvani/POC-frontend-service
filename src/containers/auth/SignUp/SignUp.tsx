import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import "./SignUp.css";
import * as coreService from "../../../services/coreService";
import * as toastrService from "../../../services/toastrService";
import ApiLoader from "../../../components/apiLoader/ApiLoader";

type FormValues = {
  domain: string;
  first_name: string;
  last_name: string;
  tenant_name: string;
  email: string;
  password: string;
};

function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  let domainEnd = process.env.REACT_APP_Signup_Domain_End;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function togglePass() {
    setShowPassword(!showPassword);
  }

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fqdn", data.domain);
    formData.append("tenant_name", data.tenant_name);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    coreService
      .post("auth/register", formData)
      .then((res: any) => {
        setLoading(false);
        if (res?.data?.message){
          navigate("/auth/login");
        }
        else {
          toastrService.error(res?.data?.error);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  };

  return (
    <>
      <form
        autoComplete="off"
        className="auth-form d-grid align-items-center p-3 p-sm-4 p-xl-5 h-100 overflow-auto sign-up"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-100">
          <h2 className="gilroy-bold">Sign Up</h2>
          <p className="gilroy-medium">Create an account</p>

          {/* <div className="relative py-2">
            <label htmlFor="domain">
              Domain <span className="required">*</span>
            </label>
            <Tooltip placement="right" title="Please enter the domain name associated with your website or service. Ensure accurate spelling and formatting for proper identification.">
              <svg className="info-icon ms-1" fill="currentColor" viewBox="0 0 20 20"
						    xmlns="http://www.w3.org/2000/svg">
						    <path fill-rule="evenodd"
						  	  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						  	  clip-rule="evenodd">
                </path>
					    </svg>
            </Tooltip>
            <div className="input-group w-100 mt-1 domain">
              <div className="input-group-prepend">
                <span
                  className="input-group-text domain-start"
                  id="basic-addon3"
                >
                  https://
                </span>
              </div>
              <input
                id="domain"
                type="text"
                {...register("domain", {
                  required: "Domain is required",
                  pattern: {
                  value: /^[A-Za-z0-9]*$/,
                  message: "Invalid domain format",
                  },
                })}
                className={`form-control ${
                  errors.domain ? "error" : ""
                }`}
                placeholder="Enter your domain name"
                pattern="^[A-Za-z0-9]*$"
              />
              <div className="input-group-append">
                <span className="input-group-text domain-end" id="basic-addon2">
                  .yash.com
                </span>
              </div>
            </div>
            {errors.domain && (
              <span className="required-error">{errors.domain.message}</span>
            )}
          </div> */}

          <div className="relative py-2">
            <label htmlFor="first_name">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              {...register("first_name", { required: "First Name is required" })}
              placeholder="Enter your first name"
              className={`w-100 p-2 mt-1 form-control ${
                errors.first_name ? "error" : ""
              }`}
            />
            {errors.first_name && (
              <span className="required-error">{errors.first_name.message}</span>
            )}
          </div>

          <div className="relative py-2">
            <label htmlFor="last_name">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              {...register("last_name", { required: "Last Name is required" })}
              placeholder="Enter your last name"
              className={`w-100 p-2 mt-1 form-control ${
                errors.last_name ? "error" : ""
              }`}
            />
            {errors.last_name && (
              <span className="required-error">{errors.last_name.message}</span>
            )}
          </div>

          {/* <div className="relative py-2">
            <label htmlFor="tenant_name">
              Company Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="tenant_name"
              {...register("tenant_name", {
                required: "Company Name is required",
              })}

              placeholder="Enter the company name"
              className={`w-100 p-2 mt-1 form-control ${
                errors.tenant_name ? "error" : ""
              }`}
            />
            {errors.tenant_name && (
              <span className="required-error">
                {errors.tenant_name.message}
              </span>
            )}
          </div> */}

          <div className="relative py-2">
            <label htmlFor="email" className="font-medium">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email address"
              className={`w-100 p-2 mt-1 border form-control ${
                errors.email ? "error" : ""
              }`}
            />
            {errors.email && (
              <span className="required-error">{errors.email.message}</span>
            )}
          </div>
          <div className="relative py-2">
            <label htmlFor="password" className="font-medium">
              Password <span className="required">*</span>
            </label>
            <input
              type={!showPassword ? "password" : "text"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter the password"
              className={`w-100 p-2 mt-1 border form-control ${
                errors.password ? "error" : ""
              }`}
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
              <span className="required-error">{errors.password.message}</span>
            )}
          </div>

          <div className="d-flex align-items-center mb-2">
            <div className="auth-info">
              Already have an account?
              <NavLink to="/auth/login"> Sign In</NavLink>
            </div>
          </div>

          <button
            className="btn btn-primary w-100 Gilroy-medium"
            type="submit"
            disabled={loading}
          >
            Sign up
          </button>
        </div>
      </form>
      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default SignUp;

import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SignUpSuccess.css";
import * as coreService from "../../../services/coreService";
import * as toastrService from "../../../services/toastrService";
import ApiLoader from "../../../components/apiLoader/ApiLoader";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
};

function SignUpSuccess() {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSend, setEmailSend] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  function resendEmail(data: FormValues) {
    setLoading(true);
    coreService
      .post("email/resend", {
        email: data.email,
      })
      .then((res: any) => {
        reset();
        setLoading(false);
        toastrService.success("Email send successfully!");
      })
      .catch((err: any) => {
        setLoading(false);
        reset();
        toastrService.error(err?.response?.data?.message);
      });
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center signup-success h-100 p-3 p-sm-4 p-xl-5">
        <img
          alt="success-gif"
          className="success-img"
          src="/assets/images/success.gif"
        />
        {!emailSend ? (
          <div className="text-center">
            <h1 className="gilroy-bold">Registered Successfully!</h1>
            <p className="gilroy-medium">
              Account Activation Link has been sent to the email address you
              provided.
            </p>
            <NavLink to="/auth/login">
              <button className="btn-primary w-50">Back to Login</button>
            </NavLink>
            <div className="auth-info mt-3">
              Didn’t get the email?{" "}
              <span className="c-pointer" onClick={() => setEmailSend(true)}>
                Resend
              </span>
            </div>
          </div>
        ) : (
          <>
            <h1 className="gilroy-bold text-center">Resend Email</h1>
            <form
              autoComplete="off"
              className="w-100"
              onSubmit={handleSubmit(resendEmail)}
              noValidate
            >
              <div className="relative py-1 w-100">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="w-100 p-2 mt-1 form-control"
                  placeholder="Enter your email address"
                  id="email"
                  required
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="required-error mb-0">Email is required</p>
                )}
              </div>
              <button
                className="btn btn-primary w-100 mt-2"
                type="submit"
                disabled={loading}
              >
                Send Email
              </button>
            </form>
            <div className="auth-info mt-3">
              <NavLink to="/auth/login">Back to Login</NavLink>
            </div>
          </>
        )}
      </div>
      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default SignUpSuccess;

import React, { Suspense } from "react";
import { RouteObject, Navigate } from "react-router-dom";
import { useLocation, useRoutes } from "react-router-dom";
import { AuthGuard, AuthProvider, AdminGuard } from "../authGuard/AuthGuard";

const Auth = React.lazy(() => import("../containers/auth/Auth"));
const Login = React.lazy(() => import("../containers/auth/Login/Login"));
const SignUp = React.lazy(() => import("../containers/auth/SignUp/SignUp"));

const SignUpSuccess = React.lazy(
  () => import("../containers/auth/signUpSuccess/SignUpSuccess")
);
const Loader = React.lazy(() => import("../components/loader/Loader"));

const LayoutComponent = React.lazy(() => import("../containers/layout/Layout"));
const HomeComponent = React.lazy(() => import("../containers/home/Home"));
const ProjectComponent = React.lazy(
  () => import("../containers/projects/Projects")
);
const InsightsComponent = React.lazy(
  () => import("../containers/insights/Insights")
);

const SettingsComponent = React.lazy(
  () => import("../containers/settings/Settings")
);
const UserProfileComponent = React.lazy(
  () => import("../containers/userProfile/UserProfile")
);

// const AddEmployeeComponent = React.lazy(
//   () => import("../containers/addEmployee/AddEmployee")
// );

const PageNotFound = React.lazy(
  () => import("../containers/pageNotFound/PageNotFound")
);

const GetRoutes = () => {
  let location = useLocation();
  let routes: RouteObject[] = [
    {
      path: "auth",
      element: AuthGuard() ? <Navigate to={"/home"} replace /> : <Auth />,
      children: [
        { path: "", element: <Navigate to={"login"} /> },
        {
          path: "login",
          element: (
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "sign-up",
          element: (
            <Suspense fallback={<Loader />}>
              <SignUp />
            </Suspense>
          ),
        },
        {
          path: "sign-up-success",
          element: <SignUpSuccess />,
        }
      ],
    },
    {
      path: "",
      element: AuthGuard() ? (
        <Suspense fallback={<Loader />}>
          <LayoutComponent />
        </Suspense>
      ) : (
        <Navigate to={"auth"} state={{ from: location }} replace />
      ),
      children: [
        { path: "", element: <Navigate to={"/home"} /> },
        {
          path: "/home",
          element: (
            <Suspense fallback={<Loader />}>
              <HomeComponent />
            </Suspense>
          ),
        },
        {
          path: "/projects",
          element: AdminGuard() ? (
            <Suspense fallback={<Loader />}>
              <ProjectComponent />
            </Suspense>
          ) : (
            <Navigate to={"/home"} state={{ from: location }} replace />
          ),
        },
        {
          path: "/insights",
          element: (
            <Suspense fallback={<Loader />}>
              <InsightsComponent />
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: AdminGuard() ? (
            <Suspense fallback={<Loader />}>
              <SettingsComponent />
            </Suspense>
          ) : (
            <Navigate to={"/home"} state={{ from: location }} replace />
          ),
        },
       {
          path: "/user/profile",
          element: <UserProfileComponent />,
        }
      ],
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loader />}>
          <PageNotFound />
        </Suspense>
      ),
    },
  ];
  return useRoutes(routes);
};

const Routing: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <AuthProvider>
          <GetRoutes />
        </AuthProvider>
      </Suspense>
    </>
  );
};

export default Routing;

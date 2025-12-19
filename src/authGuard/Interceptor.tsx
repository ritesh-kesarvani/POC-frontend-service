import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

function intercept(req: AxiosRequestConfig) {
  if (req.url?.match("register")) {
    req.baseURL = process.env.REACT_APP_ADMIN_API_URL;
  } else {
    // req.baseURL = window.location.origin + "/api/v1/"
    req.baseURL = process.env.REACT_APP_BASE_API_URL;
  }

  if (
    req.method === "post" ||
    req.method === "get" ||
    req.method === "put" ||
    req.method === "delete"
  ) {
    if (!req.url?.match("login") && localStorage?.["$pay$heet"]) {
      req.headers = {
        Authorization: "Bearer " + localStorage?.["$pay$heet"],
        "app-id": localStorage?.["$pay$heet-!d"] || null,
      };
    }
  }
  if (req.headers && !req.url?.match("employee/import-excel")) {
    req.headers["Content-Type"] = "application/json";
  }
  return req;
}

const onRequest: any = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return intercept(config);
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // let naviaget = useNavigate();
  let err: any = error.response || error.message;
  if (err.status === 401 || err.status === 403) {
    localStorage.removeItem("$pay$heet");
    localStorage.removeItem("$pay$heet-!d");
    localStorage.removeItem("$u$er");
    if (!window["location"].href.match("/auth/login")) {
      const query = window["location"].search.split("?")[1];
      const returnUrl = encodeURIComponent(
        `${window["location"].pathname}${query ? "?" + query : ""}`
      );
      window["location"].href = `/auth/login?returnUrl=${returnUrl}`;
    }
    // naviaget("/auth/login");
  }

  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

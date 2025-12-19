import { useNavigate } from "react-router-dom";
import { setupInterceptorsTo } from "../authGuard/Interceptor";

import axios from 'axios';

export function get(url: string) {
    return axios.get(url);
}

export function remove(url: string) {
    return axios.delete(url);
}

export function post(url: string, option?: any) {
    return axios.post(url, option);
}

export function put(url: string, option?: any) {
    return axios.put(url, option);
}

export function useNavigateHook() {
  const navigate = useNavigate();
  return navigate;
}

setupInterceptorsTo(axios);

export default axios;
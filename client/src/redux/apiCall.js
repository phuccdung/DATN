import { loginFailure, loginStart, loginSuccess } from "./slices/userSlice";
import axios from "axios";

const BASE_URL = "http://localhost:3500/";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(BASE_URL+"auth", user);
    dispatch(loginSuccess(res.data));
    return true;
  } catch (err) {
    dispatch(loginFailure());
    return false;
  }
};
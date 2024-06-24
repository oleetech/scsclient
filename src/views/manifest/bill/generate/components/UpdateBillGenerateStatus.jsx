import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import { toast } from "react-toastify";

export const updateBillGenerationStatus = async (uploadID) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  try {
    await axios.put(
      `${apiUrl}/upload/billGenerate/${uploadID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      }
    );
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error(
        "Token got expired for security issues. You are redirecting to login page."
      );
      window.location.href = "/";
    } else {
      console.error(error);
    }
  }
};

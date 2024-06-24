import axios from "axios";
import { toast } from "react-toastify";
import {
  isAdminLoggedIn,
  isEmployeeLoggedIn,
  apiUrl,
} from "../../ApiUrlAndToken";

export const getAdmins = async () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  try {
    const response = await axios.get(`${apiUrl}/admin`, {
      headers: {
        Authorization: `Bearer ${
          isAdminLoggedIn
            ? adminData.tokens.accessToken
            : userData.tokens.accessToken
        }`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error(
        "Token got expired for security issues. You are redirecting to login page."
      );
      window.location.href = "/";
    } else {
      console.error("Error fetching admin data:", error);
    }
  }
};

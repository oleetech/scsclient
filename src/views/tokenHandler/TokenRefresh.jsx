import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../ApiUrlAndToken";
import { toast } from "react-toastify";

let initialCallDone = false;
// Function to refresh the access token
async function refreshAccessToken(refreshTokenOld) {
  try {
    const response = await axios.post(
      `${apiUrl}/${isAdminLoggedIn ? "admin" : "user"}/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshTokenOld}`,
        },
      }
    );

    const { accessToken, refreshToken } = response.data;

    // console.log("old refreshToken:", refreshTokenOld);
    // console.log("new accessToken:", accessToken);
    // console.log("new refreshToken:", refreshToken);

    if (isAdminLoggedIn) {
      const parsedAdminData = JSON.parse(localStorage.getItem("admin"));
      parsedAdminData.tokens.accessToken = accessToken;
      parsedAdminData.tokens.refreshToken = refreshToken;

      localStorage.setItem("admin", JSON.stringify(parsedAdminData));
    } else {
      const userData = JSON.parse(localStorage.getItem("employee"));
      userData.tokens.accessToken = accessToken;
      userData.tokens.refreshToken = refreshToken;

      localStorage.setItem("employee", JSON.stringify(userData));
    }

    return accessToken;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error(
        "Token got expired for security issues. You are redirecting to login page."
      );
      window.location.href = "/";
    } else {
      console.error("Error refreshing access token:", error);
    }
    throw error;
  }
}

// Function to periodically check token expiry and refresh if needed
function checkTokenExpiry() {
  let refreshTokenOld;

  if (isAdminLoggedIn) {
    const isAdmin = window.localStorage.getItem("admin");
    const adminData = JSON.parse(isAdmin);
    refreshTokenOld = adminData.tokens.refreshToken;
  } else if (isEmployeeLoggedIn) {
    const isEmployee = window.localStorage.getItem("employee");
    const userData = JSON.parse(isEmployee);
    refreshTokenOld = userData.tokens.refreshToken;
  }
  if (initialCallDone) {
    refreshAccessToken(refreshTokenOld);
  } else {
    initialCallDone = true;
  }
}

// Periodically check token expiry every 14 minutes
// setInterval(checkTokenExpiry, 14 * 60 * 1000); // Run every 14 minutes
setTimeout(() => {
  checkTokenExpiry();
  setInterval(checkTokenExpiry, 4 * 60 * 1000);
}, 4 * 60 * 1000);

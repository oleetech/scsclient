import axios from "axios";
import { apiUrl, isAdminLoggedIn, isEmployeeLoggedIn } from "../ApiUrlAndToken";
import { toast } from "react-toastify";

export const ManifestHeaders = [
  "No.",
  "MANIFEST_DATE",
  "AWB",
  "WEIGHT",
  "COURIER_TYPE",
  "Fr.COST($)",
  "Fr.COST(TK)",
  "CUSTOM (Parcel_Rate_TK) ",
  "TOTAL(TK)",
];

let adminData;
let userData;
if (isAdminLoggedIn) {
  adminData = JSON.parse(window.localStorage.getItem("admin"));
} else if (isEmployeeLoggedIn) {
  userData = JSON.parse(window.localStorage.getItem("employee"));
}

export const fetchConversionRateByID = async (id) => {
  try {
    const response = await axios.get(
      `${apiUrl}/conversion-bdt/getValue/${id}`,
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
    return response.data.bdt_value;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error(
        "Token got expired for security issues. You are redirecting to login page."
      );
      window.location.href = "/";
    } else {
      console.error(error);
    }
    return null;
  }
};

export const fetchLocationCostByID = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/location-rate/getRate/${id}`, {
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
      console.error(error);
    }
    return null;
  }
};

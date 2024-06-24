// http://scsapi.courierltd.com
export const apiUrl = process.env.REACT_APP_API_BASE_URL;
export const isAdminLoggedIn = window.localStorage.getItem("admin");
export const adminData = JSON.parse(isAdminLoggedIn);

export const isEmployeeLoggedIn = window.localStorage.getItem("employee");
export const userData = JSON.parse(isEmployeeLoggedIn);

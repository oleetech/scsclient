import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import MonthlyIcon from "@mui/icons-material/AccountBalanceOutlined";
import UsersIcon from "@mui/icons-material/PeopleAltOutlined";
import ManifestIcon from "@mui/icons-material/TableView";
import LocationIcon from "@mui/icons-material/AddLocationAltOutlined";
import UploadIcon from "@mui/icons-material/UploadFile";
import BillsIcon from "@mui/icons-material/RequestQuoteOutlined";

export const inputStyle =
  "block p-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer";
export const labelStyle =
  "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6";
export const positiveButton =
  "rounded-md w-max py-[1px] px-1 text-lg text-white bg-green-500 hover:bg-green-600 cursor-pointer";
export const negativeButtom =
  "rounded-md w-max py-1 px-3 text-lg text-white bg-red-500 hover:bg-red-600 cursor-pointer";
export const blackButton =
  "ml-auto rounded-md w-max py-1 px-3 text-lg text-white bg-black hover:scale-110 transition-transform duration-300 cursor-pointer";
export const blackLinkButton =
  "w-max h-max bg-black text-white font-semibold p-2 pl-4 pr-4 rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer";
export const generalRateInput =
  "input input-bordered w-20 input-sm bg-gray-100 focus:bg-white";
export const generalInput =
  "input input-bordered input-md w-64 bg-gray-100 focus:bg-white";
export const generalselect =
  "select select-bordered select-md w-64 bg-gray-100 focus:bg-white";
export const allFirstDiv = "md:ml-[200px] min-h-screen pt-2 font-[Poppins]";
export const allSecondDiv =
  "flex flex-col gap-6 h-full bg-white m-2 p-5 md:m-12 md:p-12 bg-white shadow-sm";

export const submitButton =
  "text-white bg-gradient-to-r from-orange-500 via-orange-700 to-orange-900 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg px-3 py-2 mt-3";

export const hoverScale =
  "hover:scale-105 transition-transform duration-300 hover:cursor-pointer";

export const generalInputField =
  "input input-bordered input-primary max-w-xs bg-transparent border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange-500 focus:outline-none focus:ring-0 focus:border-orange-500 peer";

export const generalTableInputField = `px-3 py-1 text-sm flex-1 h-10 bg-transparent border w-24 md:w-36`;

export const generalTextAreaField =
  "textarea textarea-primary w-full max-w-xs bg-base-50";

export const inputEyeIcon = "cursor-pointer absolute right-3 top-2.5";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ManageExcelManifestHeadres = [
  "ID",
  "AWB_NO",
  "SHIPPER",
  "SHIPPER_ADDRESS",
  "CONSIGNEE",
  "BIN_VAT",
  "DEST",
  "CNEE_ADDRESS",
  "CTC",
  "TEL_NO",
  "NOP",
  "WT",
  "VOL",
  "DSCT",
  "COD",
  "VAL",
  "RE",
  "BAG_NO",
];

export const userPanel = [
  {
    name: "Dashboard",
    path: "/dashboard",
    Icons: <DashboardIcon fontSize="inherit" />,
  },
  {
    name: "Customers",
    path: "/customers",
    Icons: <MonthlyIcon fontSize="inherit" />,
  },
  {
    name: "Upload Manifest",
    path: "/upload-manifest",
    Icons: <UploadIcon fontSize="inherit" />,
  },
  {
    name: "Manage Manifest",
    path: "/manage-manifest",
    Icons: <ManifestIcon fontSize="inherit" />,
  },
  {
    name: "See Bills",
    path: "/see-bills",
    Icons: <BillsIcon fontSize="inherit" />,
  },
  {
    name: "Location Cost",
    path: "/location-cost",
    Icons: <LocationIcon fontSize="inherit" />,
  },
  {
    name: "Users",
    path: "/users",
    Icons: <UsersIcon fontSize="inherit" />,
  },
];

export const keyLabelMapping = {
  awb: "AWB NO",
  name: "SHIPPER",
  address: "SHIPPER ADDRESS",
  consigne: "CONSIGNEE",
  bin_vat: "BIN/VAT",
  dest: "DEST",
  cnee_address: "CNEE ADDRESS",
  ctc: "CTC",
  tel_no: "TEL NO.",
  nop: "NOP",
  weight: "WT",
  volume: "VOL",
  dsct: "DSCT",
  cod: "COD",
  val: "VAL",
  re: "RE",
  bag_no: "BAG NO",
};

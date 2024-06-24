import React, { useState } from "react";
import GeneralInput from "../../../../components/GeneralInput";
import {
  generalTextAreaField,
  submitButton,
} from "../../../../components/DesignStandardize";
import { toast } from "react-toastify";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../ApiUrlAndToken";

const EditRow = ({ row }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  const [infos, setInfos] = useState({
    awb: row.awb,
    address: row.address || "",
    bin_vat: row.bin_vat,
    bag_no: row.bag_no || "",
    consigne: row.consigne || "",
    cnee_address: row.cnee_address || "",
    ctc: row.ctc || "",
    cod: parseFloat(row.cod),
    dest: row.dest || "",
    dsct: row.dsct || "",
    nop: row.nop,
    re: row.re || "",
    tel_no: row.tel_no,
    volume: row.volume,
    val: row.val,
    weight: row.weight,
  });

  const updateInfo = async (e) => {
    e.preventDefault();

    try {
      const data = {
        awb: String(infos.awb),
        address: String(infos.address) || "",
        bin_vat: String(infos.bin_vat),
        bag_no: String(infos.bag_no) || "",
        consigne: String(infos.consigne) || "",
        cnee_address: String(infos.cnee_address) || "",
        ctc: String(infos.ctc) || "",
        cod: parseFloat(infos.cod),
        dest: String(infos.dest) || "",
        dsct: String(infos.dsct) || "",
        nop: parseInt(infos.nop),
        re: String(infos.re) || "",
        tel_no: parseInt(infos.tel_no),
        volume: parseFloat(infos.volume),
        val: parseFloat(infos.val),
        weight: parseInt(infos.weight),
      };
      // console.log(data);
      if (data.weight >= 0) {
        // const response =
        await axios.put(`${apiUrl}/upload/${row.uploadid}`, data, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });

        toast.success("Record has been updated!!");
        window.location.reload();
      } else {
        toast.error("Weight cannot be less than 0.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else if (error.response) {
        toast.error(`${error.response.data.message}`);
      } else if (error.request) {
        toast.error("No response received from the server");
      } else {
        toast.error("An error occurred while processing the request");
      }
    }
  };

  return (
    <>
      <p className="text-center mx-auto font-semibold">
        For - <span className="font-semibold">{row.awb}</span>
      </p>
      <form className="flex flex-col gap-3" onSubmit={updateInfo}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-96 overflow-auto px-2">
          {/* <GeneralInput
            label="SHIPPER"
            type="textarea"
            placeholder="..."
            value={row.name}
          /> */}
          <div className={`w-60 flex flex-col gap-2`}>
            <label className="flex flex-row gap-2">SHIPPER</label>
            <div className={`${generalTextAreaField}`}>{row.name}</div>
          </div>

          <GeneralInput
            id={infos.consigne}
            label="CONSIGNEE"
            type="textarea"
            placeholder="..."
            value={infos.consigne}
            onChange={(e) => {
              setInfos({ ...infos, consigne: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.address}
            label="SHIPPER ADDRESS"
            type="textarea"
            placeholder="..."
            value={infos.address}
            onChange={(e) => {
              setInfos({ ...infos, address: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.cnee_address}
            label="CNEE ADDRESS"
            type="textarea"
            placeholder="..."
            value={infos.cnee_address}
            onChange={(e) => {
              setInfos({ ...infos, cnee_address: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.bin_vat}
            label="BIN/VAT"
            type="number"
            placeholder="..."
            value={infos.bin_vat}
            onChange={(e) => {
              setInfos({ ...infos, bin_vat: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.dest}
            label="DEST"
            type="text"
            placeholder="..."
            value={infos.dest}
            onChange={(e) => {
              setInfos({ ...infos, dest: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.ctc}
            label="CTC"
            type="text"
            placeholder="..."
            value={infos.ctc}
            onChange={(e) => {
              setInfos({ ...infos, ctc: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.tel_no}
            label="TEL No."
            type="number"
            placeholder="..."
            value={infos.tel_no}
            onChange={(e) => {
              setInfos({ ...infos, tel_no: e.target.value });
            }}
          />
          <GeneralInput
            id={infos.nop}
            label="NOP"
            type="number"
            placeholder="..."
            value={infos.nop}
            onChange={(e) => {
              setInfos({ ...infos, nop: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.weight}
            label="WEIGHT"
            type="number"
            placeholder="..."
            value={infos.weight}
            onChange={(e) => {
              setInfos({ ...infos, weight: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.volume}
            label="VOLUME"
            type="number"
            placeholder="..."
            value={infos.volume}
            onChange={(e) => {
              setInfos({ ...infos, volume: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.val}
            label="VAL"
            type="number"
            placeholder="..."
            value={infos.val}
            onChange={(e) => {
              setInfos({ ...infos, val: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.dsct}
            label="DSCT"
            type="textarea"
            placeholder="..."
            value={infos.dsct}
            onChange={(e) => {
              setInfos({ ...infos, dsct: e.target.value });
            }}
          />
          <GeneralInput
            id={infos.cod}
            label="COD"
            type="number"
            placeholder="..."
            value={infos.cod}
            onChange={(e) => {
              setInfos({ ...infos, cod: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.re}
            label="RE"
            type="text"
            placeholder="..."
            value={infos.re}
            onChange={(e) => {
              setInfos({ ...infos, re: e.target.value });
            }}
          />

          <GeneralInput
            id={infos.bag_no}
            label="BAG No."
            type="text"
            placeholder="..."
            value={infos.bag_no}
            onChange={(e) => {
              setInfos({ ...infos, bag_no: e.target.value });
            }}
          />
        </div>
        <button className={`${submitButton} mx-auto`}>Update</button>
      </form>
    </>
  );
};

export default EditRow;

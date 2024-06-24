import React from "react";

const UploadRecordId = ({ uploadRecord }) => {
  // console.log(uploadRecord);
  return (
    <div className="flex flex-col">
      <p className="text-lg font-semibold mx-auto mt-3">Record Details</p>
      <h1 className="text-lg font-semibold border-b border-spacing-2 text-center mx-[10px]">
        {uploadRecord.name}
      </h1>
      <div className="flex flex-col gap-1 bg-[#eef0f1] rounded-xl shadow hover:shadow-md p-4">
        <div className="flex flex-row flex-wrap md:grid md:grid-cols-3 lg:grid-cols-4 ">
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">AWB: </span>
            {uploadRecord.awb}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">DEST: </span>
            {uploadRecord.dest}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">CTC: </span>
            {uploadRecord.ctc}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">NOP: </span>
            {uploadRecord.nop}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">WEIGHT: </span>
            {uploadRecord.weight}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">DSCT: </span>
            {uploadRecord.dsct}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">COD: </span>
            {uploadRecord.cod}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">VALUE: </span>
            {uploadRecord.val}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">BIN/VAT: </span>
            {uploadRecord.bin_vat}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">TEL NO: </span>
            {uploadRecord.tel_no}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">VOLUME: </span>
            {uploadRecord.volume}{" "}
          </p>
          <p className="border border-slate-300 p-1">
            <span className="font-semibold">RE: </span>
            {uploadRecord.re}
          </p>
        </div>

        <p>
          <span className="font-semibold">SHIPPER ADDRESS: </span>
          {uploadRecord.address}
        </p>
        <p>
          <span className="font-semibold">CONSIGNEE: </span>
          {uploadRecord.consigne}
        </p>
        <p>
          <span className="font-semibold">CNEE ADDRESS: </span>
          {uploadRecord.cnee_address}
        </p>
      </div>
    </div>
  );
};

export default UploadRecordId;

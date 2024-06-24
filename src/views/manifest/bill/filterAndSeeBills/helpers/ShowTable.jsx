import React, { useEffect, useState } from "react";
import { ManifestHeaders } from "../../../../../components/BillFilterCommon";
import { exportToExcel } from "../../../../../components/Excel_Bills";
import {
  blackLinkButton,
  monthNames,
} from "../../../../../components/DesignStandardize";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";

const ShowTable = ({ manifests, name, date, month, year, excelFileName }) => {
  const [finalManifests, setFinalManifests] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const finalManifest = manifests.map((item) => {
      const spxCostValue =
        item.scr_value !== undefined && item.scr_value !== null
          ? parseFloat(item.scr_value - item.frCostBDT).toFixed(2)
          : item.scs_value !== undefined && item.scs_value !== null
          ? parseFloat(item.scs_value - item.frCostBDT).toFixed(2)
          : item.spxpp_value !== undefined && item.spxpp_value !== null
          ? parseFloat(item.spxpp_value).toFixed(2)
          : 0;

      const totalValue =
        parseFloat(item.scr_value) ||
        parseFloat(item.scs_value) ||
        parseFloat(item.spxpp_value) ||
        parseFloat(item.pcr_value) ||
        parseFloat(item.pcs_value) ||
        0;

      return {
        DATE: item.date,
        AWB: item.awb,
        WGT: item.weight,
        ITEM: item.customValue,
        Fr_COST_USD: parseFloat(item.frCostUSD) || "",
        Fr_COST_TK: parseFloat(item.frCostBDT) || "",
        CUSTOME: spxCostValue,
        TOTAL: totalValue,
      };
    });
    const total = finalManifest.reduce(
      (acc, curr) => acc + parseFloat(curr.TOTAL) || 0,
      0
    );
    setTotalValue(total);
    setFinalManifests(finalManifest);
  }, [manifests]);

  const handleDownload = () => {
    exportToExcel(finalManifests, `Bills_${excelFileName}.xlsx`);
  };

  console.log(manifests);
  return (
    <>
      <button onClick={handleDownload} className={`${blackLinkButton} mx-auto`}>
        <DownloadIcon fontSize="inherit" /> Download as Excel
      </button>

      <div className="flex flex-col gap-1">
        <div className="text-center">
          Bill of{" "}
          <div className="font-semibold">
            {name && month && year ? (
              <>
                <p className="no-underline">
                  {monthNames[month - 1]}, {year}
                </p>
                <p className="underline underline-offset-2">{name}</p>
              </>
            ) : date ? (
              <p className="underline underline-offset-2">{date}</p>
            ) : month && year ? (
              <p className="underline underline-offset-2">
                {monthNames[month - 1]}, {year}
              </p>
            ) : name ? (
              <p className="underline underline-offset-2">{name}</p>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="max-h-[600px] overflow-auto border-t border-slate-300">
          <table id="table-to-download" className="text-center md:w-full">
            <thead>
              <tr className="bg-gray-300 border-b border-slate-300">
                {ManifestHeaders.map((header, index) => (
                  <th key={index} className="border border-slate-400 p-1">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {manifests.map((item, index) => (
                <tr key={index} className={`bg-inherit`}>
                  <td className="border border-slate-400 p-1">{index + 1}</td>
                  <td className="border border-slate-400 p-1">{item.date}</td>
                  <td className="border border-slate-400 p-1">{item.awb}</td>
                  <td className="border border-slate-400 p-1">{item.weight}</td>
                  <td className="border border-slate-400 p-1">
                    {item.customValue}
                  </td>
                  {/* fr cost usd */}
                  <td className="border border-slate-400 p-1">
                    {item.frCostUSD}
                  </td>

                  {/* fr cost bdt */}
                  <td className="border border-slate-400 p-1">
                    {item.frCostBDT}
                  </td>

                  {/* parcel rate */}
                  <td className="border border-slate-400 p-1">
                    {(item.scr_value === 0 ||
                      item.scs_value === 0 ||
                      item.spxpp_value === 0) &&
                      0.0}
                    {item.scr_value !== null &&
                      item.scr_value !== 0 &&
                      `${parseFloat(item.scr_value - item.frCostBDT).toFixed(
                        2
                      )}`}
                    {item.scs_value !== null &&
                      item.scs_value !== 0 &&
                      `${parseFloat(item.scs_value - item.frCostBDT).toFixed(
                        2
                      )}`}
                    {item.spxpp_value !== null &&
                      item.spxpp_value !== 0 &&
                      `${parseFloat(item.spxpp_value).toFixed(2)}`}
                  </td>

                  <td className="border border-slate-400 p-1">
                    {item.pcr_value !== null &&
                      `${parseFloat(item.pcr_value).toFixed(2)}`}
                    {item.scr_value !== null &&
                      `${parseFloat(item.scr_value).toFixed(2)}`}
                    {item.pcs_value !== null &&
                      `${parseFloat(item.pcs_value).toFixed(2)}`}
                    {item.scs_value !== null &&
                      `${parseFloat(item.scs_value).toFixed(2)}`}
                    {item.spxpp_value !== null &&
                      `${parseFloat(item.spxpp_value).toFixed(2)}`}
                    {item.pcr_value === null &&
                      item.scr_value === null &&
                      item.pcs_value === null &&
                      item.scs_value === null &&
                      item.spxpp_value === null &&
                      0}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-300">
                <td
                  colSpan={8}
                  className="border border-slate-400 p-1 font-semibold"
                >
                  Total
                </td>
                <td className="border border-slate-400 p-1 font-semibold">
                  {totalValue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ShowTable;

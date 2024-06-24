import { toast } from "react-toastify";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import {
  fetchConversionRateByID,
  fetchLocationCostByID,
} from "../../../../../components/BillFilterCommon";
import axios from "axios";

export const fetchBillsGeneric = async (url) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  const response = await axios.get(`${apiUrl}/upload/${url}`, {
    headers: {
      Authorization: `Bearer ${
        isAdminLoggedIn
          ? adminData.tokens.accessToken
          : userData.tokens.accessToken
      }`,
    },
  });

  if (response.data.status === 404) {
    toast.error(`${response.data.message}`);
    return [];
  } else {
    // Filter out records with billgenerate === true
    const filteredManifests = response.data
      .filter((manifest) => manifest.billgenerate === true)
      .sort((a, b) => a.uploadid - b.uploadid);

    const updatedManifests = await Promise.all(
      filteredManifests.map(async (manifest) => {
        let customValue;
        let bdt_value = null;
        let locationCost = null;

        if (manifest.pcr_value !== null) {
          customValue = "P-CC-RO";
          locationCost = await fetchLocationCostByID(manifest.pcrlocationrate);
          bdt_value = await fetchConversionRateByID(manifest.pcrconversion);
        } else if (manifest.scr_value !== null) {
          customValue = "SPX-CC-RO";
          locationCost = await fetchLocationCostByID(manifest.scrlocationrate);
          bdt_value = await fetchConversionRateByID(manifest.scrconversion);
        } else if (manifest.pcs_value !== null) {
          customValue = "P-CC-Standard";
          bdt_value = await fetchConversionRateByID(manifest.pcsconversion);
        } else if (manifest.scs_value !== null) {
          customValue = "SPX-CO-Standard";
          bdt_value = await fetchConversionRateByID(manifest.scsconversion);
        } else if (manifest.spxpp_value !== null) {
          customValue = "SPX-PP";
        } else {
          customValue = "P-PP";
        }

        let frCostBDT = null;
        let frCostUSD = null;
        if (locationCost && bdt_value) {
          if (manifest.weight === 0) {
            frCostBDT = (0).toFixed(2);
          } else if (manifest.weight > 0 && manifest.weight < 1) {
            frCostBDT = (1 * locationCost.rate_1 * bdt_value).toFixed(2);
          } else if (manifest.weight > 1 && manifest.weight < 50) {
            frCostBDT = (
              (1 * locationCost.rate_1 +
                (manifest.weight - 1) * locationCost.rate_2) *
              bdt_value
            ).toFixed(2);
          } else {
            frCostBDT = (manifest.weight * bdt_value).toFixed(2);
          }
          frCostUSD = (frCostBDT / bdt_value).toFixed(2);
        }

        if (
          bdt_value &&
          (customValue === "P-CC-Standard" || customValue === "SPX-CO-Standard")
        ) {
          frCostUSD = (manifest.cod + manifest.cod * 0.1).toFixed(2);
          frCostBDT = (frCostUSD * bdt_value).toFixed(2);
        }

        return {
          ...manifest,
          customValue,
          bdt_value,
          frCostBDT,
          frCostUSD,
        };
      })
    );
    return updatedManifests;
  }
};

import React, { useEffect, useState } from "react";
import GeneralSelect from "../../../../../components/GeneralSelect";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import { useParams } from "react-router-dom";
import UploadRecordId from "./UploadRecordId";
import {
  monthNames,
  submitButton,
} from "../../../../../components/DesignStandardize";
import { toast } from "react-toastify";
import GeneralInput from "../../../../../components/GeneralInput";
import { updateBillGenerationStatus } from "./UpdateBillGenerateStatus";

const BillGenerate = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  const { id } = useParams();
  const [othersParcelRate, setOthersParcelRate] = useState(0);

  const [selectPaperOrParcel, setSelectPaperOrParcel] = useState("");
  const [selectCcOrPp, setSelectCcOrPp] = useState("");
  const [selectRoOrStandard, setSelectRoOrStandard] = useState("");

  const CourierTypeFirst = [
    { value: "Paper(P)", label: "Paper(P)" },
    { value: "Parcel(SPX)", label: "Parcel(SPX)" },
  ];

  const CourierTypeSecond = [
    { value: "CC", label: "CC" },
    { value: "PP", label: "PP" },
  ];

  const CourierTypeThird = [
    { value: "RO", label: "RO" },
    { value: "Standard", label: "Standard" },
  ];

  // To get all locations and rate for Parcel rate --------------------------------------------------------------------------------
  const [parcelRateOptions, setParcelRateOptions] = useState([]);
  const [selectedParcelRateLocation, setSelectedParcelRateLocation] =
    useState(null);
  const [parcelRate, setParcelRate] = useState(0);
  const getSPXLocationRate = async () => {
    try {
      const response = await axios.get(`${apiUrl}/parcelrate/getAll`, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });
      const formattedOptions = response.data.map((item) => ({
        label: `${item.location}`,
        value: item,
      }));
      setParcelRateOptions(formattedOptions);
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

  // To get all locations for RO type courier --------------------------------------------------------------------------------
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationRate, setLocationRate] = useState("Location Rate");
  const getLocations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/location-rate/getAll`, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });
      const formattedOptions = response.data.map((item) => ({
        label: `${item.location_from} to ${item.location_to}`,
        value: item,
      }));
      setLocationOptions(formattedOptions);
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

  // USD to BDT Conversion handle --------------------------------------------------------------------------------
  const [U_B_Coptions, setU_B_COptions] = useState([]);
  const [selectedU_B_C, setSelectedU_B_C] = useState(null);
  const [U_B_CValue, setU_B_CValue] = useState("");
  const handleSelectU_B_C = async (selectedOption) => {
    setSelectedU_B_C(selectedOption);
    const { month, year } = selectedOption.value;

    try {
      const response = await axios.get(
        `${apiUrl}/conversion-bdt/getOne/${month}/${year}`,
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
      setU_B_CValue(response.data.bdt_value);
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

  // To get and set the options of usd to bdt conversions --------------------------------------------------------------------------------
  useEffect(() => {
    const getUsdToBdtConversion = async () => {
      try {
        const response = await axios.get(`${apiUrl}/conversion-bdt/getAll`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });

        const formattedOptions = response.data.map((item) => ({
          label: `${monthNames[item.month - 1]}, ${item.year}`,
          value: item,
        }));
        setU_B_COptions(formattedOptions);
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
    getUsdToBdtConversion();
  }, []);

  // To get and set the information for the selected record --------------------------------------------------------------------------------
  const [uploadRecord, setUploadRecordByID] = useState([]);
  useEffect(() => {
    const getUploadRecordByID = async () => {
      try {
        const response = await axios.get(`${apiUrl}/upload/getOne/${id}`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        setUploadRecordByID(response.data);
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
    getUploadRecordByID();
  }, [id]);

  // To reset states --------------------------------------------------------------------------------
  const resetAll = () => {
    setSelectedU_B_C(null);
    setU_B_CValue("");
    setSelectedLocation(null);
    setLocationRate("Location Rate");
    setSelectedParcelRateLocation(null);
    setParcelRate(0);
  };

  const styleForCourierFlow =
    "flex flex-row flex-wrap gap-1 font-blod -translate-y-1 transition-transform duration-500 font-semibold text-lg";
  const styleBillEuqationBox =
    "border-2 border-orange-200 flex flex-col gap-3 text-center h-max w-max mx-auto min-w-56";

  let uploadID = parseInt(id);
  let weight = uploadRecord[0]?.weight;
  let ChinaBasedUSD = uploadRecord[0]?.cod;
  let month = selectedU_B_C?.value.month;
  let year = selectedU_B_C?.value.year;
  let location_from = selectedLocation?.value.location_from;
  let location_to = selectedLocation?.value.location_to;
  let internal_location = selectedParcelRateLocation?.label;
  let other_rate = parseFloat(othersParcelRate);
  const validateFields = (fields) =>
    fields.every((field) => field !== undefined && field !== null);

  const billGenerationAPI = async (url, data) => {
    if (selectPaperOrParcel === "Paper(P)" && selectCcOrPp === "PP") {
      updateBillGenerationStatus(uploadID);
    } else {
      await axios.post(`${apiUrl}${url}`, data, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });
      updateBillGenerationStatus(uploadID);
    }
    console.log(
      "Selected Bill Type:",
      selectPaperOrParcel,
      selectCcOrPp,
      selectRoOrStandard
    );
    // console.log("Bill Type Data:", data);
    // console.log("API Endpoint:", url);
    toast.success("Bill has been generated!!!");
    setTimeout(() => {
      window.location.href = "/manage-manifest";
    }, 500);
  };
  const GenerateBillSPX_CC = async () => {
    try {
      const billTypes = [
        // SCR
        {
          condition: validateFields([
            selectCcOrPp === "CC",
            selectRoOrStandard === "RO",
            uploadID,
            weight,
            month,
            year,
            location_from,
            location_to,
            internal_location,
            other_rate,
          ]),
          url: "/parcelcalculations/scr",
          data: {
            uploadID,
            locationFrom: location_from,
            locationTo: location_to,
            internal_location,
            conversionMonth: month,
            conversionYear: year,
            weight,
            other_rate,
          },
        },
        // SCS
        {
          condition: validateFields([
            selectCcOrPp === "CC",
            selectRoOrStandard === "Standard",
            uploadID,
            weight,
            ChinaBasedUSD,
            month,
            year,
            internal_location,
            other_rate,
          ]),
          url: "/parcelcalculations/scs",
          data: {
            uploadID,
            weight,
            chinaBasedUSD: ChinaBasedUSD,
            conversionMonth: month,
            conversionYear: year,
            internal_location,
            other_rate,
          },
        },
      ];
      const billType = billTypes.find((type) => type.condition);
      if (billType) {
        await billGenerationAPI(billType.url, billType.data);
      } else {
        toast.error(`Some required values are missing.`);
      }
    } catch (error) {
      toast.error(`An error occurred during bill generation.`);
    }
  };
  const GenerateBillSPX_PP = async () => {
    try {
      const weight = uploadRecord[0]?.weight;
      const internal_location = selectedParcelRateLocation?.label;
      const other_rate = parseFloat(othersParcelRate);

      const billType = {
        condition: validateFields([
          uploadID,
          weight,
          internal_location,
          other_rate,
        ]),
        url: "/parcelcalculations/spx-pp",
        data: { uploadID, weight, internal_location, other_rate },
      };

      if (billType.condition) {
        await billGenerationAPI(billType.url, billType.data);
      } else {
        toast.error(`Some required values are missing.`);
      }
    } catch (error) {
      toast.error(`An error occurred during bill generation.`);
    }
  };
  const GenerateBillPaper = async () => {
    try {
      const billTypes = [
        // PCR
        {
          condition: validateFields([
            selectPaperOrParcel === "Paper(P)",
            selectCcOrPp === "CC",
            selectRoOrStandard === "RO",
            uploadID,
            weight,
            month,
            year,
            location_from,
            location_to,
          ]),
          url: "/papercalculation/pcr",
          data: {
            uploadID,
            weight,
            conversionMonth: month,
            conversionYear: year,
            locationFrom: location_from,
            locationTo: location_to,
          },
        },
        // PCS
        {
          condition: validateFields([
            selectPaperOrParcel === "Paper(P)",
            selectCcOrPp === "CC",
            selectRoOrStandard === "Standard",
            uploadID,
            month,
            year,
            ChinaBasedUSD,
          ]),
          url: "/papercalculation/pcs",
          data: {
            uploadID,
            ChinaBasedUSD,
            conversionMonth: month,
            conversionYear: year,
          },
        },
        // PPP
        {
          condition:
            selectPaperOrParcel === "Paper(P)" &&
            selectCcOrPp === "PP" &&
            uploadID !== undefined,
          url: "",
          data: {},
        },
      ];

      const billType = billTypes.find((type) => type.condition);

      if (billType) {
        await billGenerationAPI(billType.url, billType.data);
      } else {
        toast.error(`Some required values are missing.`);
      }
    } catch (error) {
      toast.error(`An error occurred during bill generation.`);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {uploadRecord[0] && <UploadRecordId uploadRecord={uploadRecord[0]} />}

        <div className="flex flex-col gap-5">
          {/*---------------------------------  Parcel Type Flow Show in Text starts ---------------------------------*/}
          <>
            {selectPaperOrParcel === "" ? (
              <p className="animate-pulse">Select Courier Type</p>
            ) : selectCcOrPp === "" ? (
              <p className={`${styleForCourierFlow}`}>
                {selectPaperOrParcel} -
                <span className="animate-pulse">Select CC/PP</span>
              </p>
            ) : selectCcOrPp === "PP" ? (
              <p className={`${styleForCourierFlow}`}>
                {selectPaperOrParcel} - {selectCcOrPp}
              </p>
            ) : selectRoOrStandard === "" ? (
              <p className={`${styleForCourierFlow}`}>
                {selectPaperOrParcel} - {selectCcOrPp} -
                <span className="animate-pulse">Select RO/Standard</span>
              </p>
            ) : (
              <p className={`${styleForCourierFlow}`}>
                {selectPaperOrParcel} - {selectCcOrPp} - {selectRoOrStandard}
              </p>
            )}
          </>
          {/*---------------------------------  Parcel Type Flow Show in Text ends ---------------------------------*/}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0">
            {/*---------------------------------  Selection of courier type starts --------------------------------- */}
            <div className="flex flex-row flex-wrap gap-4 md:border-r">
              {/* Select Paper(P) or Parcel(SPX) */}
              <GeneralSelect
                options={CourierTypeFirst}
                label="Paper(P) or Parcel(SPX)"
                placeholder="Paper/Parcel"
                onChange={(selectedOption) => {
                  setSelectCcOrPp("");
                  setSelectRoOrStandard("");
                  resetAll();
                  setSelectPaperOrParcel(selectedOption.value);
                  getSPXLocationRate();
                }}
                value={
                  CourierTypeFirst.find(
                    (option) => option.value === selectPaperOrParcel
                  ) || ""
                }
              />

              {/* Select CC or PP */}
              {selectPaperOrParcel !== "" && (
                <GeneralSelect
                  options={CourierTypeSecond}
                  label="Select CC or PP"
                  placeholder="CC/PP"
                  onChange={(selectedOption) => {
                    setSelectCcOrPp("");
                    setSelectRoOrStandard("");
                    resetAll();
                    setSelectCcOrPp(selectedOption.value);
                  }}
                  value={
                    CourierTypeSecond.find(
                      (option) => option.value === selectCcOrPp
                    ) || ""
                  }
                />
              )}

              {/* Select RO or Standard when selectCcOrPp === "CC"*/}
              {selectPaperOrParcel !== "" && selectCcOrPp === "CC" && (
                <GeneralSelect
                  options={CourierTypeThird}
                  label="Select RO or Standard"
                  placeholder="RO/Standard"
                  onChange={(selectedOption) => {
                    resetAll();
                    setSelectRoOrStandard("");
                    setSelectRoOrStandard(selectedOption.value);
                    getLocations();
                  }}
                  value={
                    CourierTypeThird.find(
                      (option) => option.value === selectRoOrStandard
                    ) || ""
                  }
                />
              )}

              {/* Select Location to get Location Rate for outside to inside country
                  &&
                  Select Month and Year to get USD Conversion Rate */}
              {selectCcOrPp === "CC" && (
                <>
                  {/* Select Location to get Location Rate for outside to inside country  */}
                  {selectRoOrStandard === "RO" && (
                    <GeneralSelect
                      options={locationOptions}
                      label="Select Location Rate"
                      placeholder="Location From - To"
                      onChange={(selectedOption) => {
                        setSelectedLocation(selectedOption);
                        setLocationRate(selectedOption.value);
                      }}
                      value={selectedLocation}
                    />
                  )}

                  {/* Select Month and Year to get USD Conversion Rate  */}
                  <GeneralSelect
                    options={U_B_Coptions}
                    label="Select USD Conversion Rate"
                    placeholder="Month,Year"
                    onChange={handleSelectU_B_C}
                    value={selectedU_B_C}
                  />
                </>
              )}

              {/* Select Parcel Rate of inside country  */}
              {selectPaperOrParcel === "Parcel(SPX)" && (
                <GeneralSelect
                  options={parcelRateOptions}
                  label="Select Parcel Rate"
                  placeholder="Location"
                  onChange={(selectedOption) => {
                    setOthersParcelRate(0);
                    setSelectedParcelRateLocation(selectedOption);
                    setParcelRate(selectedOption.value);
                  }}
                  value={selectedParcelRateLocation}
                />
              )}

              {/* Select Parcel Rate of inside country === OTHERS, then input field to take input of parcel rate for exclusive cases  */}
              {parcelRate.location === "OTHERS" &&
                uploadRecord[0].weight > 0 && (
                  <GeneralInput
                    label="Custome Parcel Rate"
                    labelSpanText="*"
                    type="number"
                    placeholder="Enter Parcel Rate"
                    value={othersParcelRate}
                    onChange={(e) => {
                      setOthersParcelRate(e.target.value);
                    }}
                  />
                )}
            </div>
            {/*---------------------------------  Selection of courier type ends --------------------------------- */}

            {/*--------------------------------- Show Bill equation starts --------------------------------- */}
            {uploadRecord[0].weight >= 0 ? (
              selectPaperOrParcel !== "" &&
              selectCcOrPp !== "" && (
                <div className="flex flex-col gap-3 md:border-l">
                  <div className={`${styleBillEuqationBox}`}>
                    <p className="font-semibold bg-orange-200 p-2 text-lg">
                      Total Cost
                    </p>
                    <div className="p-2">
                      {selectCcOrPp === "CC" &&
                        selectRoOrStandard === "RO" &&
                        uploadRecord[0] &&
                        U_B_CValue !== "" &&
                        (selectPaperOrParcel === "Paper(P)" ? (
                          <p>
                            {uploadRecord[0].weight < 50 &&
                            uploadRecord[0].weight > 0 ? (
                              <>
                                ((1*{locationRate.rate_1}) + (
                                {uploadRecord[0].weight - 1}*
                                {locationRate.rate_2}) ) * {U_B_CValue}
                              </>
                            ) : uploadRecord[0].weight >= 50 ? (
                              <>
                                {uploadRecord[0].weight}*{locationRate.rate_3} *{" "}
                                {U_B_CValue}
                              </>
                            ) : (
                              uploadRecord[0].weight === 0 && (
                                <p>
                                  0{" "}
                                  <span className="text-red-500 animate-pulse font-semibold">
                                    (because weight is 0)
                                  </span>
                                </p>
                              )
                            )}
                          </p>
                        ) : (
                          locationRate !== "Location Rate" &&
                          parcelRate !== 0 && (
                            <p>
                              {uploadRecord[0].weight < 50 && //0<weight<50
                              uploadRecord[0].weight > 0 ? (
                                <>
                                  ((1*{locationRate.rate_1}) + (
                                  {uploadRecord[0].weight - 1}*
                                  {locationRate.rate_2}) ) * {U_B_CValue} +{" "}
                                  {parcelRate.location === "OTHERS"
                                    ? uploadRecord[0].weight * othersParcelRate
                                    : uploadRecord[0].weight > 1
                                    ? uploadRecord[0].weight * parcelRate?.rate2
                                    : uploadRecord[0].weight *
                                      parcelRate?.rate1}
                                </>
                              ) : uploadRecord[0].weight >= 50 ? ( //w>=50
                                <>
                                  {uploadRecord[0].weight}*{locationRate.rate_3}{" "}
                                  * {U_B_CValue} +{" "}
                                  {parcelRate.location === "OTHERS"
                                    ? uploadRecord[0].weight * othersParcelRate
                                    : uploadRecord[0].weight * parcelRate.rate2}
                                </>
                              ) : (
                                uploadRecord[0].weight === 0 && (
                                  //w <= 0
                                  <p>
                                    0{" "}
                                    <span className="text-red-500 animate-pulse font-semibold">
                                      (because weight is 0)
                                    </span>
                                  </p>
                                )
                              )}
                            </p>
                          )
                        ))}

                      {selectCcOrPp === "CC" &&
                        selectRoOrStandard === "Standard" &&
                        U_B_CValue !== "" &&
                        (selectPaperOrParcel === "Paper(P)" ? (
                          <p>
                            (
                            {uploadRecord[0].cod ? (
                              uploadRecord[0].cod
                            ) : (
                              <span className="text-red-500 font-semibold animate-pulse">
                                COD missing
                              </span>
                            )}{" "}
                            + {uploadRecord[0].cod}*10%) * {U_B_CValue}
                          </p>
                        ) : (
                          (locationRate !== "Location Rate" ||
                            parcelRate !== 0) && (
                            <p>
                              ((
                              {uploadRecord[0].cod ? (
                                uploadRecord[0].cod
                              ) : (
                                <span className="text-red-500 font-semibold animate-pulse">
                                  COD missing
                                </span>
                              )}{" "}
                              + {uploadRecord[0].cod}*10%)* {U_B_CValue}) +{" "}
                              {parcelRate.location === "OTHERS" &&
                              uploadRecord[0].weight > 0
                                ? uploadRecord[0].weight * othersParcelRate
                                : uploadRecord[0].weight > 1
                                ? uploadRecord[0].weight * parcelRate?.rate2
                                : uploadRecord[0].weight <= 1 &&
                                  uploadRecord[0].weight > 0
                                ? uploadRecord[0].weight * parcelRate?.rate1
                                : uploadRecord[0].weight === 0 && (
                                    <p>
                                      0{" "}
                                      <span className="text-red-500 animate-pulse font-semibold">
                                        (because weight is 0)
                                      </span>
                                    </p>
                                  )}
                            </p>
                          )
                        ))}

                      {selectCcOrPp === "PP" &&
                        (selectPaperOrParcel === "Paper(P)" ? (
                          <p>No Billing</p>
                        ) : (
                          (locationRate !== "Location Rate" ||
                            parcelRate !== 0) && (
                            <p>
                              {" "}
                              {parcelRate.location === "OTHERS"
                                ? uploadRecord[0].weight * othersParcelRate
                                : uploadRecord[0].weight > 1
                                ? uploadRecord[0].weight * parcelRate?.rate2
                                : uploadRecord[0].weight <= 1 &&
                                  uploadRecord[0].weight > 0
                                ? uploadRecord[0].weight * parcelRate?.rate1
                                : uploadRecord[0].weight === 0 && (
                                    <p>
                                      0{" "}
                                      <span className="text-red-500 animate-pulse font-semibold">
                                        (because weight is 0)
                                      </span>
                                    </p>
                                  )}
                            </p>
                          )
                        ))}

                      {parcelRate === 0 &&
                        selectCcOrPp !== "PP" &&
                        locationRate === "Location Rate" &&
                        selectedU_B_C?.value.month === null && (
                          <p>Select the necessary fields</p>
                        )}
                    </div>
                  </div>

                  {/*--------------------------------- Button to generate bill --------------------------------- */}
                  <button
                    onClick={() => {
                      selectPaperOrParcel === "Parcel(SPX)"
                        ? selectCcOrPp === "CC"
                          ? GenerateBillSPX_CC()
                          : GenerateBillSPX_PP()
                        : GenerateBillPaper();
                    }}
                    className={`${submitButton} mt-3 mx-auto`}
                  >
                    Generate Bill
                  </button>
                </div>
              )
            ) : (
              <div className={`${styleBillEuqationBox}`}>
                <p className="p-2 text-red-500 animate-pulse font-semibold">
                  Weight can not be less then 0.
                </p>
              </div>
            )}

            {/*--------------------------------- Show Bill equation ends --------------------------------- */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillGenerate;

import React, { useState } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EyeCloseIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/AddBoxOutlined";
import {
  generalInputField,
  generalTextAreaField,
  hoverScale,
  inputEyeIcon,
  generalTableInputField,
} from "./DesignStandardize";

const GeneralInput = ({
  label,
  labelSpanText,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  accept,
  addItems,
  buttonFuntion,
  table,
  min,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      buttonFuntion();
    }
  };

  return (
    <div className={`${table === 1 ? "w-40" : "w-60"} flex flex-col gap-2`}>
      <label className="flex flex-row gap-2">
        {label}

        {labelSpanText && (
          <span className="font-semibold text-red-600">{labelSpanText}</span>
        )}
      </label>
      <div className="flex flex-row relative">
        {type === "password" ? (
          <input
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`${generalInputField}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        ) : type === "textarea" ? (
          <textarea
            className={`${
              table === 1 ? generalTableInputField : generalTextAreaField
            }`}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${
              table === 1 ? generalTableInputField : generalInputField
            }`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            accept={accept}
            onKeyDown={addItems === 1 ? handleKeyPress : undefined}
            min={min}
          />
        )}

        {type === "password" && (
          <button
            type="button"
            className={`${inputEyeIcon} ${hoverScale}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
          </button>
        )}
        {addItems === 1 && (
          <button
            type="button"
            className={`${inputEyeIcon} ${hoverScale}`}
            onClick={buttonFuntion}
          >
            <AddIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default GeneralInput;

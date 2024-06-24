import React from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select";
const animatedComponents = makeAnimated();

const GeneralSelect = ({
  label,
  labelSpanText,
  placeholder,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2 w-60">
      <label className="flex flex-row gap-2">
        {label} {labelSpanText}
      </label>
      <Select
        closeMenuOnSelect={true}
        components={animatedComponents}
        defaultValue={[options[0]]}
        options={options}
        onChange={onChange}
        value={value}
        placeholder={placeholder ?? ""}
        classNames={{
          option: (state) =>
            `!cursor-pointer !rounded-my-4
        ${
          state.isSelected
            ? "!bg-orange-200 !text-black font-semibold"
            : state.isFocused
            ? "!bg-orange-100 !text-black"
            : "!bg-transparent !text-neutral-900"
        }`,
          control: () =>
            `!bg-white !rounded-lg !border-[1px] !border-orange !border-solid`,
          menu: () => `!bg-orange-50 !rounded-lg`,
        }}
        styles={{
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "white" : "black",
            backgroundColor: state.isSelected ? "#6fa0eb" : "white",
            padding: 10,
          }),
          control: (base) => ({
            ...base,
            border: 1,
            outline: 1,
            height: "46px",
            boxShadow: "none",
          }),
        }}
      />
    </div>
  );
};

export default GeneralSelect;

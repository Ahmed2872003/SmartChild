import { useFormContext } from "react-hook-form";

export const SelectField = ({
  label,
  options,
  value,
  onChange,
  name,
  disabled,
  ...other
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-4 text-left">
      <select
        name={name}
        disabled={disabled}
        className={`w-full rounded-full border border-gray-300 bg-transparent px-5 py-3.5 text-sm 
          focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all 
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
          ${
            errors[name]
              ? "border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
          }`}
        value={value}
        onChange={onChange}
        {...register("gender", { required: "Required" })}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div>
        {errors[name] && (
          <p className="text-xs text-red-500 font-medium whitespace-pre-line px-2">
            {errors[name].message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectField;

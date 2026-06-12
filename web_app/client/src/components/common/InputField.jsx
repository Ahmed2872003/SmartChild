import { forwardRef, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

const InputField = (
  {
    label,
    type = "text",
    placeholder,
    icon: Icon,
    value,
    onChange,
    name,
    actionLabel,
    onAction,
    disabled,
    required,
    error,
    ...other
  },
  ref,
) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const currentType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-4 text-left relative">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 ${error ? "text-red-400" : "text-gray-400"}`}
            />
          </div>
        )}

        <input
          ref={ref}
          type={currentType}
          name={name}
          required={required}
          disabled={disabled}
          className={`w-full rounded-full border bg-transparent px-5 py-3.5 text-sm transition-all outline-none
            ${Icon ? "pl-11" : ""} 
            ${isPasswordType ? "pr-11" : ""} // Add padding on the right for the eye icon
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...other}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex justify-between items-start mt-1.5 px-2">
        <div className="flex-1">
          {error && (
            <p className="text-xs text-red-500 font-medium whitespace-pre-line">
              {error}
            </p>
          )}
        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            disabled={disabled}
            className="text-xs font-semibold text-gray-600 hover:text-black underline decoration-gray-300 underline-offset-2 disabled:opacity-50"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

InputField.displayName = "InputField";

export default forwardRef(InputField);

import InputField from "@/components/common/InputField";
import { THEME } from "@/constants/config";
import { Lock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useResetPass } from "@/hooks/auth";

const ResetPassword = () => {
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues: getFormData,
  } = useForm();

  const resetPass = useResetPass();

  const handleResetPass = (data) => {
    resetPass.mutate({ data, token });
  };

  const validatePasswords = (pass, confirmPass) =>
    pass === confirmPass || "Passwords do not match";

  return (
    <div className="text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock size={32} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
        Create New Password
      </h2>
      <p className="text-gray-500 mb-8 font-medium">
        Please enter your new password below.
      </p>

      <form className="space-y-3" onSubmit={handleSubmit(handleResetPass)}>
        <InputField
          type="password"
          placeholder="New Password"
          {...register("password", {
            validate: (value) =>
              validatePasswords(value, getFormData("passwordConfirm")),
            deps: ["passwordConfirm"],
          })}
          icon={Lock}
          required
          disabled={resetPass.isPending}
          error={errors.password?.message}
        />
        <InputField
          type="password"
          placeholder="Re-enter Password"
          {...register("passwordConfirm", {
            validate: (value) =>
              validatePasswords(getFormData("password"), value),
            deps: ["password"],
          })}
          icon={Lock}
          required
          disabled={resetPass.isPending}
          error={errors.passwordConfirm?.message}
        />

        <button
          type="submit"
          disabled={resetPass.isPending}
          className={`w-full mt-4 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg`}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

import { Lock, ShieldCheck } from "lucide-react";
import InputField from "../../common/InputField";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/auth";

const SecurityForm = () => {
  const formDefaultValues = {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm(formDefaultValues);

  const changePass = useChangePassword();

  const handleUpdatePassSubmit = (formData) => {
    changePass
      .mutateAsync(formData)
      .then(() => reset())
      .catch((e) => {});
  };

  const isMatch = (pass, confirmPass) => pass === confirmPass;

  return (
    <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="w-5 h-5 text-[#E5B427]" />
        <h2 className="text-xl font-bold">Security</h2>
      </div>

      <form
        className="space-y-6 max-w-2xl"
        onSubmit={handleSubmit(handleUpdatePassSubmit)}
      >
        <InputField
          type="password"
          placeholder="Current Password"
          icon={Lock}
          {...register("currentPassword", { required: "Required" })}
          error={errors.currentPassword?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            type="password"
            placeholder="New Password"
            icon={Lock}
            {...register("newPassword", {
              required: "Required",
              validate: (newPass) =>
                isMatch(newPass, getValues("newPasswordConfirm")) ||
                "New Password doesn't match",
              deps: ["newPasswordConfirm"],
            })}
            error={errors.newPassword?.message}
          />

          <InputField
            type="password"
            placeholder="Confirm New Password"
            icon={Lock}
            {...register("newPasswordConfirm", {
              required: "Required",
              validate: (newPassConfirm) =>
                isMatch(getValues("newPassword"), newPassConfirm) ||
                "New Password doesn't match",
              deps: ["newPassword"],
            })}
            error={errors.newPasswordConfirm?.message}
          />
        </div>

        <button
          type="submit"
          disabled={changePass.isPending}
          className="bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:bg-slate-800 transition-all active:scale-95"
        >
          Update Password
        </button>
      </form>
    </section>
  );
};

export { SecurityForm };

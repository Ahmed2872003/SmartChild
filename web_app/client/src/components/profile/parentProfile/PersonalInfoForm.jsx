import { AlertCircle, BadgeCheck, Mail, Save, User } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "../../common/InputField";
import ImageInputField from "../../common/ImageInputField";
import { namePattern } from "@/constants/pattern";
import { THEME } from "@/constants/config";
import { useTimer } from "@/hooks/Timer";
import { useVerifyEmail } from "@/hooks/auth";
import { useUpdateUser } from "@/hooks/user";
import { useEffect } from "react";

const PersonalInfoForm = ({ user }) => {
  const form = useForm({
    defaultValues: {
      name: user.name,
      photo: "",
    },
  });

  const formErrors = form.formState.errors;

  const timer = useTimer({
    ascending: false,
    durationSec: 60,
  });

  const verifyEmail = useVerifyEmail();

  const updateUser = useUpdateUser();

  const handleUpdateProfile = (formData) => {
    const dirtyFields = form.formState.dirtyFields;

    const changedData = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {});

    if (changedData.photo) changedData.photo = changedData.photo[0];

    formData = new FormData();

    for (const k in changedData) formData.append(k, changedData[k]);

    updateUser.mutate(formData);
  };

  const handleEmailVerfication = () => {
    timer.setActive(true);

    verifyEmail.mutate({ email: user.email });
  };

  // if(updateUser.isSuccess) form.reset()
  useEffect(() => {
    if (updateUser.isSuccess) form.reset({ name: user.name, photo: "" });
  }, [updateUser.isSuccess]);

  return (
    <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateProfile)}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-[#E5B427]" />
            <h2 className="text-xl font-bold">Personal Details</h2>
          </div>

          <ImageInputField
            initialPhoto={`${import.meta.env.VITE_IMG_BASE_URL}/${user.photo}`}
          />
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              type="text"
              placeholder="Display Name"
              icon={User}
              {...form.register("name", {
                required: "Required",
                pattern: {
                  value: namePattern.pattern,
                  message: namePattern.description,
                },
              })}
              error={formErrors.name?.message}
            />

            <InputField
              type="email"
              placeholder="Email"
              defaultValue={user.email}
              disabled={true}
              icon={Mail}
            />
          </div>

          <button
            type="submit"
            disabled={!form.formState.isDirty || updateUser.isPending}
            className={`${THEME.primaryYellow} hover:bg-[#E5B427] text-slate-900 font-bold py-4 px-10 rounded-full shadow-lg shadow-yellow-100 transition-all active:scale-95 flex items-center gap-2`}
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          {/* Email Verification Banner */}
          {!user.verifiedEmail && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50 border border-orange-100 p-5 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Your email is not verified
                  </p>
                  <p className="text-xs text-slate-600">
                    Please verify your email to unlock all features.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={timer.isActive}
                onClick={handleEmailVerfication}
                className="whitespace-nowrap min-w-36 select-none bg-white text-slate-900 text-xs font-bold py-2.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                {timer.isActive
                  ? `Resend In ${timer.value}`
                  : "Send Verification"}
              </button>
            </div>
          )}

          {user.verifiedEmail && (
            <div className="flex items-center gap-2 text-green-600 ml-4">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm font-bold">Verified Account</span>
            </div>
          )}
        </form>
      </FormProvider>
    </section>
  );
};

export { PersonalInfoForm };

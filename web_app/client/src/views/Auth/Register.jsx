import SocialLogin from "@/components/auth/SocialLogin";
import InputField from "@/components/common/InputField";
import { THEME } from "@/constants/config";
import { Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignup } from "@/hooks/auth";
import { emailPattern, namePattern } from "@/constants/pattern";

const Register = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    ...form
  } = useForm();

  const signup = useSignup();

  const handleSignup = (data) => {
    signup.mutate(data);
  };

  const isMatch = (pass, confirmPass) => pass === confirmPass;

  return (
    <div className="text-center animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
        Create Account
      </h2>
      <p className="text-gray-500 mb-8 font-medium">
        Let's set up your parent dashboard.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit(handleSignup)}>
        <InputField
          placeholder="Full Name"
          type="text"
          {...register("name", {
            required: "required",
            pattern: {
              value: namePattern.pattern,
              message: namePattern.description,
            },
          })}
          error={formErrors.name?.message}
          icon={User}
        />
        <InputField
          placeholder="Email Address"
          type="email"
          {...register("email", {
            required: "required",
            pattern: {
              value: emailPattern.pattern,
              message: `Enter a valid email address.\n${emailPattern.description}`,
            },
          })}
          error={formErrors.email?.message}
          icon={Mail}
        />
        <InputField
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "required",
            validate: (value) =>
              isMatch(value, form.getValues("passwordConfirm")) ||
              "Passwords do not match",
            deps: ["passwordConfirm"],
          })}
          error={formErrors.password?.message}
          icon={Lock}
        />

        <InputField
          placeholder="Confirm Password"
          type="password"
          {...register("passwordConfirm", {
            required: "required",
            validate: (value) =>
              isMatch(form.getValues("password"), value) ||
              "Passwords do not match",
            deps: ["password"],
          })}
          error={formErrors.passwordConfirm?.message}
          icon={Lock}
        />
        <button
          type="submit"
          disabled={signup.isPending}
          className={`w-full mt-4 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
        >
          Sign up
        </button>
        <SocialLogin />
      </form>
      <div className="mt-8 text-sm font-semibold text-gray-500">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-black underline decoration-2 underline-offset-4 hover:text-[#FFC82C] transition-colors"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Register;

import { useVerifyEmail } from "@/hooks/auth";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const time = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your@email.com";
  const [timeLeft, setTimeLeft] = useState(time);

  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResetLink = () => {
    setTimeLeft(time);

    verifyEmail.mutate({ email });
  };

  return (
    <div className="text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail size={32} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
        Check your email
      </h2>
      <p className="text-gray-500 mb-6 font-medium leading-relaxed">
        We've sent an activation link to <br />
        <span className="font-bold text-gray-800">{email}</span>
      </p>

      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-blue-800 font-medium text-sm mb-6 shadow-sm">
        Once your account is activated, you can{" "}
        <button
          onClick={() => navigate("/login")}
          className="font-bold underline hover:text-blue-600 transition-colors"
        >
          log in here
        </button>
        .
      </div>

      <div className="mt-8 text-sm font-semibold text-gray-500">
        Didn't receive the email? <br />
        {timeLeft > 0 ? (
          <span className="text-gray-400 inline-block mt-2">
            Resend link in {timeLeft}s
          </span>
        ) : (
          <button
            onClick={handleResetLink}
            className="text-black underline decoration-2 underline-offset-4 hover:text-[#FFC82C] transition-colors mt-2"
          >
            Resend now
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

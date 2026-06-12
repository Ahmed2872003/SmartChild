import { useConfirmEmail } from "@/hooks/auth";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ConfirmEmail() {
  const { token } = useParams();

  const confirmEmail = useConfirmEmail();

  useEffect(() => {
    confirmEmail.mutate(token);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 text-center">
        {confirmEmail.isPending && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[#2D2D2D]">Verifying...</h2>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-[#FFD131]/20 border-t-[#FFD131] rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 text-lg">
              Hang tight! We're confirming your email address.
            </p>
          </div>
        )}

        {confirmEmail.isSuccess && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#89B07C]/10 text-[#89B07C] rounded-full flex items-center justify-center mx-auto text-4xl">
              ✓
            </div>
            <h2 className="text-3xl font-black text-[#2D2D2D]">All Set!</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Your email has been verified. You're ready to start your child's
              journey!
            </p>
          </div>
        )}

        {confirmEmail.isError && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center mx-auto text-4xl font-light">
              ✕
            </div>
            <h2 className="text-3xl font-black text-[#2D2D2D]">Oops!</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              This link is invalid. Please request a new verification email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

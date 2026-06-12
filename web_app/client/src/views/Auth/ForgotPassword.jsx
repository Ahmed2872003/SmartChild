import InputField from '@/components/common/InputField';
import { IS_DEV, THEME } from '@/constants/config';
import { Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useForgotPass } from '@/hooks/auth';
import { emailPattern } from '@/constants/pattern';

const timeDuration = 60;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const email = state?.email || '';

  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues: getFormData,
    formState: { errors },
  } = useForm({ defaultValues: { email } });

  const [timeLeft, setTimeLeft] = useState(timeDuration);

  const forgotPass = useForgotPass();

  useEffect(() => {
    if (isSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isSent, timeLeft]);

  const forgotPassSubmit = async (data) => {
    try {
      await forgotPass.mutateAsync(data);

      setIsSent(true);
    } catch (err) {
      // console.error(err);
    }
  };

  if (isSent) {
    return (
      <div className="text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Link Sent!</h2>
        <p className="text-gray-500 mb-6 font-medium leading-relaxed">
          If an account exists for{' '}
          <span className="font-bold text-gray-800">{getFormData('email') || 'that address'}</span>, we have sent a
          password reset link.
        </p>

        <button
          onClick={() => navigate('/login')}
          className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg`}
        >
          Back to Login
        </button>

        <div className="mt-8 text-sm font-semibold text-gray-500">
          Didn't receive the email? <br />
          {timeLeft > 0 ? (
            <span className="text-gray-400 inline-block mt-2">Resend link in {timeLeft}s</span>
          ) : (
            <button
              onClick={() => {
                setTimeLeft(timeDuration);
                forgotPassSubmit(getFormData());
              }}
              className="text-black underline decoration-2 underline-offset-4 hover:text-[#FFC82C] transition-colors mt-2"
            >
              Resend now
            </button>
          )}
        </div>

        {/* DEV TOOL BUTTON */}
        {IS_DEV && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">🛠️ Dev Tools</p>
            <button
              onClick={() => navigate('/reset-password')}
              className="text-sm font-bold text-blue-500 hover:text-blue-700 underline"
            >
              Simulate clicking link in email
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock size={32} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Reset Password</h2>
      <p className="text-gray-500 mb-8 font-medium">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit(forgotPassSubmit)}>
        <InputField
          type="email"
          placeholder="Email Address"
          disabled={forgotPass.isPending}
          {...register('email', {
            required: 'required',
            pattern: {
              value: emailPattern,
              message: 'Enter a valid email address',
            },
          })}
          error={errors.email?.message}
          icon={Mail}
        />
        <button
          type="submit"
          disabled={forgotPass.isPending}
          className={`w-full mt-4 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg`}
        >
          Send Reset Link
        </button>
      </form>
      <div className="mt-8 text-sm font-semibold text-gray-500">
        Remember your password?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-black underline decoration-2 underline-offset-4 hover:text-[#FFC82C] transition-colors"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;

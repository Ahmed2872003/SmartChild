import SocialLogin from '@/components/auth/SocialLogin';
import InputField from '@/components/common/InputField';
import { THEME } from '@/constants/config';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useLogin } from '@/hooks/auth';
import { emailPattern } from '@/constants/pattern';
import { useEffect } from 'react';
import { useGetUser } from '@/hooks/user';

const Login = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    handleSubmit,
    register,
    getValues: getFormData,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    login.mutate(data);
  };

  return (
    <div className="text-center animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Log in</h2>
      <div className="text-sm text-gray-600 mb-8 font-medium">
        New here?{' '}
        <button
          onClick={() => navigate('/register')}
          className="font-bold text-black underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-[#FFC82C]"
        >
          Create an account
        </button>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit(handleLogin)}>
        <InputField
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'required',
            pattern: {
              value: emailPattern,
              message: 'Enter a valid email address',
            },
          })}
          error={errors.email?.message}
          icon={Mail}
          actionLabel="Forget password?"
          onAction={() =>
            navigate('/forgot-password', {
              state: { email: getFormData('email') },
            })
          }
        />
        <InputField
          type="password"
          placeholder="Password"
          {...register('password', {
            required: 'required',
          })}
          error={errors.password?.message}
          icon={Lock}
        />
        <button
          type="submit"
          disabled={login.isPending}
          className={`w-full mt-4 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg`}
        >
          Log in
        </button>
        <SocialLogin />
      </form>
    </div>
  );
};

export default Login;

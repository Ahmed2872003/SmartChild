import { THEME } from "../../constants/config";

const SocialLogin = () => {
  return (
    <div className="mt-8 text-center">
      <div className="text-sm text-gray-500 mb-4 font-medium">
        or log in with
      </div>
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${THEME.primaryYellow} ${THEME.primaryYellowHover} transition-colors shadow-sm`}
        >
          <svg
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </button>
        <button
          type="button"
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${THEME.primaryYellow} ${THEME.primaryYellowHover} transition-colors shadow-sm`}
        >
          <svg className="w-5 h-5 text-black" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
        </button>
        <button
          type="button"
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${THEME.primaryYellow} ${THEME.primaryYellowHover} transition-colors shadow-sm`}
        >
          <svg
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.78 1.18.06 2.3.43 3.08 1.14-2.5 1.5-2.05 4.85.35 5.86-1.1 2.3-2.1 4.54-3.24 5.95M12.03 7.24c-.16-2.73 2.15-4.5 4.19-4.85.45 2.73-2.4 4.88-4.19 4.85" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;

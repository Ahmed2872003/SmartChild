import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="relative">
        <p className="text-9xl font-extrabold text-gray-100 select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-widest bg-white px-2">
            Page Not Found
          </span>
        </div>
      </div>

      <div className="text-center max-w-xl">
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Oops! This page is playing hide-and-seek.
        </h1>

        <div className="mt-12 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-sm transition-all hover:shadow-md text-sm leading-6"
            style={{
              backgroundColor: "#E5B427",
              color: "#030712",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Go To Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export { NotFoundPage };

import { ASSETS } from '@/assets';
import { FacebookIcon, InstagramIcon } from '@/components/common/BrandIcons';
import { THEME } from '@/constants/config';
import { useGetUser } from '@/hooks/user';
import { MessageCircle, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const userQuery = useGetUser(null, { silent_error: true });

  const isLoggedIn = userQuery.isSuccess;

  return (
    <div className={`min-h-screen bg-white font-sans overflow-x-hidden text-gray-900`}>
      {/* NAVIGATION */}
      <nav className="w-full px-6 h-20 md:h-24 md:px-20 flex items-center justify-between">
        <img
          className="w-14 md:w-16 cursor-pointer active:scale-95 transition-transform"
          src={ASSETS.logo}
          alt="smart-child-logo"
        />
        <div className="hidden md:flex gap-10 font-bold text-gray-800 text-sm">
          <a
            href="#"
            className="hover:text-black border-b-2 border-transparent hover:border-yellow-400 transition-all pb-1"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="hover:text-black border-b-2 border-transparent hover:border-yellow-400 transition-all pb-1"
          >
            How it works
          </a>
          <a
            href="#for-parents"
            className="hover:text-black border-b-2 border-transparent hover:border-yellow-400 transition-all pb-1"
          >
            For Parents
          </a>
          <a
            href="#assessments"
            className="hover:text-black border-b-2 border-transparent hover:border-yellow-400 transition-all pb-1"
          >
            Assessments
          </a>
        </div>
        <div
          className={`flex gap-3 items-center min-w-[205px] justify-end ${userQuery.isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
        >
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/parent/dashboard')}
              className={`${THEME.primaryYellow} px-6 py-2.5 rounded-full font-bold shadow-sm  transition-colors hover:bg-[#E5B427] text-black text-sm`}
            >
              Dashboard
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:block px-6 py-2.5 rounded-full border-2 border-gray-200 hover:border-gray-300 font-bold text-gray-700 transition-all text-sm"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/register')}
                className={`${THEME.primaryYellow} px-6 py-2.5 rounded-full font-bold shadow-sm transition-colors hover:bg-[#E5B427]  text-black text-sm`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 gap-12 bg-white relative">
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-[5.5rem] font-black text-gray-900 leading-[1.05] tracking-tight">
            This Is Not Just <br /> a Game.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-md mx-auto md:mx-0">
            Every tap, every swipe, every play is a growing step deeper about your child.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/register')}
              className={`${isLoggedIn ? 'hidden' : 'block'} ${THEME.primaryYellow} px-8 py-4 rounded-full font-black text-lg shadow-sm hover:scale-105 transition-transform text-gray-900`}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="flex-1 relative flex justify-center w-full min-h-[400px]">
          <div className="w-full max-w-md aspect-square relative mt-8">
            <img
              src={ASSETS.heroImage}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              alt="Child playing"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="w-full bg-[#FFD95A] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight text-gray-900">
            How it <span className="text-white drop-shadow-sm">Works</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:min-h-90 md:grid-cols-4 gap-6">
            <div className="bg-[#ff5e5e] p-4 rounded-3xl shadow-sm text-white flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src={ASSETS.flower} alt="flower" className="w-11" />
              </div>
              <h3 className="text-xl font-bold mb-3">Create an Account</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                Sign up as a parent and set up your profile.
              </p>
            </div>
            <div className="bg-[#ec4899] p-4 rounded-3xl shadow-sm text-white flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <img src={ASSETS.doubleHeart} alt="double-heart" />
              </div>
              <h3 className="text-xl font-bold mb-3">Add Your Child</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                Create a secure profile for each child.
              </p>
            </div>
            <div className="bg-[#86D293] p-4 rounded-3xl shadow-sm text-white flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src={ASSETS.star} alt="star" />
              </div>
              <h3 className="text-xl font-bold mb-3">Play Tests</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                Your child enjoys interactive games (tests) effortlessly.
              </p>
            </div>
            <div className="bg-[#60A5FA] p-4 rounded-3xl shadow-sm text-white flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src={ASSETS.sun} alt="sun" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get Reports</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                View deep insights into your child's cognitive development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR PARENTS SECTION */}
      <section id="for-parents" className="w-full bg-[#FFFDF8] py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#E5B427]">
              <span className="text-gray-900">For</span> Parents
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-6">
              What if play could tell you more?
            </h3>
            <div className="space-y-4 text-gray-600 font-medium text-lg leading-relaxed">
              <p>Through interactive and joyful activities, SMARTCHILD tracks every tap, interaction, and reaction.</p>
              <p>
                It's not just a game—it's a window into understanding your child's memory, reflexes, and developmental
                milestones.
              </p>
              <p>
                With visual dashboards and easy-to-read reports, you can monitor their progression and discover where
                they excel and where they might need a little extra encouragement—without them ever feeling like they
                are taking a test.
              </p>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center items-center w-full">
            <div className="absolute top-0 right-12 text-yellow-400 opacity-80 z-20">
              <Sun size={48} />
            </div>
            <div className="w-full max-w-sm relative z-10">
              <img src={ASSETS.forParents} className="w-full h-full object-cover" alt="Parent and child playing" />
            </div>
          </div>
        </div>
      </section>
      <section id="assessments" className="w-full bg-[#FFD95A] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight text-gray-900">Assessments</h2>

          <div className="flex flex-wrap xl:flex-nowrap justify-center gap-6">
            {/* Memory Test Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm w-full max-w-[260px] flex flex-col text-left hover:-translate-y-2 transition-transform">
              <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                <img src={ASSETS.memoryTest} className="w-full h-full object-cover rounded-2xl" alt="Cards" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">Memory Test</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Test recall and matching capabilities by uncovering hidden card pairs.
                </p>
                <button
                  onClick={() => navigate(isLoggedIn ? 'parent-dashboard' : 'register')}
                  className="w-full bg-[#FFC82C] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Reaction Speed Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm w-full max-w-[260px] flex flex-col text-left hover:-translate-y-2 transition-transform">
              <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                <img
                  src={ASSETS.reactionSpeedTest}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Child reacting"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">Reaction Speed</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Engages the child to tap swiftly to track alertness and attention.
                </p>
                <button
                  onClick={() => navigate(isLoggedIn ? 'parent-dashboard' : 'register')}
                  className="w-full bg-[#FFC82C] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Color Explorer Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm w-full max-w-[260px] flex flex-col text-left hover:-translate-y-2 transition-transform">
              <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                  <img src={ASSETS.colorTest} className="w-full h-full object-cover rounded-2xl" alt="Child reacting" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">Color Explorer Test</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Identify patterns, shapes and tests levels of color vision.
                </p>
                <button
                  onClick={() => navigate(isLoggedIn ? 'parent-dashboard' : 'register')}
                  className="w-full bg-[#FFC82C] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Hearing Test Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm w-full max-w-[260px] flex flex-col text-left hover:-translate-y-2 transition-transform">
              <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                <img src={ASSETS.hearingTest} className="w-full h-full object-cover rounded-2xl" alt="Listening" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">Hearing Test</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Listen carefully and recognize different external real life sounds.
                </p>
                <button
                  onClick={() => navigate(isLoggedIn ? 'parent-dashboard' : 'register')}
                  className="w-full bg-[#FFC82C] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
            {/* Free Drawing Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm w-full max-w-[260px] flex flex-col text-left hover:-translate-y-2 transition-transform">
              <div className="h-40 bg-gray-100 w-full overflow-hidden p-4 flex justify-center items-center">
                <img src={ASSETS.drawingTest} className="w-full h-full object-cover rounded-2xl" alt="Drawing" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">Free Drawing</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Encourages creative expression and fine motor skills and creativity.
                </p>
                <button
                  onClick={() => navigate(isLoggedIn ? 'parent-dashboard' : 'register')}
                  className="w-full bg-[#FFC82C] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-16 px-6 border-t border-gray-100 flex flex-col items-center text-center">
        <img className="mb-6 w-20" src={ASSETS.logo} alt="smart-child-logo" />
        <p className="text-gray-600 font-bold mb-8">Helps you to discover your child's hidden talents</p>

        <div className="flex gap-4 mb-8 text-gray-800">
          <a
            href="#"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <MessageCircle size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <FacebookIcon size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
        <div className="w-full flex justify-center items-center gap-6 mb-7">
          <button
            type="submit"
            className={`py-2 w-[35%] sm:w-[20%]  ${THEME.primaryYellow} ${THEME.textBlack} font-bold rounded-full ${THEME.primaryYellowHover} transition-colors text-sm`}
          >
            Contact Us
          </button>
        </div>

        <div className="text-sm text-gray-400 font-medium">© 2026 SmartChild. Privacy · Terms</div>
      </footer>
    </div>
  );
};

export default LandingPage;

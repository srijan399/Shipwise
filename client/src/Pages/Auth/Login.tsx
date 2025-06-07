import { useState } from "react";
// import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Truck, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, currentUser, logout } = useAuth();

  // if (currentUser) {
  //   console.log("User is already logged in:", currentUser);
  //   return null;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login form");
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      console.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main login card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6 shadow-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Sign in to your account
            </h2>
            <p className="text-blue-400 text-lg font-medium">Shipwise</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="group relative w-full flex justify-center items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>

            {/* Footer text */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Internal platform for company staff only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

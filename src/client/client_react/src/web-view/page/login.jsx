import "../scss/login.scss"; // CSS styling
import { useState, useEffect, useRef } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"; // Import Google Login
import accountService from "../../services/user-service";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data = await accountService.getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Initialize Google Login
  const loginWithGoogle = useGoogleLogin({
    scope: "profile email openid", // Đảm bảo `openid` được bao gồm
    onSuccess: (response) => {
      const token = response.access_token;
      accountService
        .verifyGoogleToken(token)
        .then(() => {
          // Điều hướng người dùng hoặc xử lý tiếp
        })
        .catch((err) => {
          console.error("Failed to verify Google token:", err);
        });
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const handleLoginSuccess = (response) => {
    const token = response.access_token;
    // Gửi token đến backend để xác minh
    accountService
      .verifyGoogleToken(token)
      .then(() => {
        // Redirect user or take any other action
      })
      .catch((err) => {
        console.error("Failed to verify Google token:", err);
      });
  };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailAddress = e.target.email.value;
    const password = e.target.password.value;
    const provider = "localLogin";
    try {
      const response = await accountService.login({
        emailAddress,
        password,
        provider,
      });
      localStorage.setItem("accessToken", response.token);
      window.location.href = "/admin";
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const ggToken = credentialResponse.credential;
      const provider = "googleLogin";
      localStorage.setItem("googleToken", ggToken);
      const response = await accountService.login({ ggToken, provider });
      localStorage.setItem("accessToken", response.token);
      window.location.href = "/admin";
    } catch (error) {
      setErrorMessage("Failed to login with Google.");
    }
  };

  // Handle Google login failure
  const handleGoogleError = () => {
    setErrorMessage("Google login failed. Please try again.");
  };

  return (
    <div className="login">
      <div className="container" id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form action="#" method="post">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social" onClick={() => loginWithGoogle()}>
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <div className="social-container">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </div>
            <span>or use your account</span>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <a href="#">Bạn quên mật khẩu ?</a>
            <button type="submit">Đăng nhập</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

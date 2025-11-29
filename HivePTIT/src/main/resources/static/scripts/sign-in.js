const API_BASE_URL = "http://localhost:8080/api";

const loginForm = document.querySelector(".form");
const loginError = document.getElementById("loginError");
const errorText = loginError?.querySelector(".form__error-text");

function showError(message) {
  if (loginError && errorText) {
    errorText.textContent = message;
    loginError.style.display = "flex";
  }
}

function hideError() {
  if (loginError) {
    loginError.style.display = "none";
  }
}

function saveAuthData(token, username, studentId, email) {
  localStorage.setItem("jwtToken", token);
  localStorage.setItem("username", username);
  localStorage.setItem("studentId", studentId);
  localStorage.setItem("email", email);
}

async function login(usernameOrEmail, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      
      if (data.token) {
        saveAuthData(data.token, data.username, data.studentId, data.email);
      }
      return { success: true, data };
    } else {
      
      return {
        success: false,
        message: data.message || "Đăng nhập thất bại. Vui lòng thử lại.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại sau.",
    };
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();

  
  hideError();

  
  const formData = new FormData(loginForm);
  const usernameOrEmail = formData.get("usernameOrEmail")?.trim();
  const password = formData.get("password");

  
  if (!usernameOrEmail || !password) {
    showError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
    return;
  }

  
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang đăng nhập...";

  try {
    
    const result = await login(usernameOrEmail, password);

    if (result.success) {
      
      showError("Đăng nhập thành công!");
      loginError.style.backgroundColor = "#22c55e";
      loginError.style.borderColor = "#22c55e";
      errorText.style.color = "#ffffff";

      
      setTimeout(() => {
        
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else {
          window.location.href = "/";
        }
      }, 1000);
    } else {
      
      showError(result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Có lỗi xảy ra. Vui lòng thử lại.");
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function init() {
  console.log("Sign-in page init");
  console.log("Current pathname:", window.location.pathname);

  
  const isSignInPage =
    window.location.pathname === "/sign-in" ||
    window.location.pathname === "/sign-in.html";

  if (!isSignInPage) {
    console.log("Not on sign-in page, skipping init");
    return;
  }

  
  const justLoggedOut = sessionStorage.getItem("justLoggedOut");
  console.log("justLoggedOut flag:", justLoggedOut);

  if (justLoggedOut) {
    
    sessionStorage.removeItem("justLoggedOut");
    console.log("User just logged out, staying on sign-in page");

    
    localStorage.clear();
  } else {
    
    const token = localStorage.getItem("jwtToken");
    console.log("JWT token exists:", !!token);

    if (token) {
      
      console.log("Token found, redirecting to home");
      window.location.href = "/";
      return;
    }
  }

  
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  
  const inputs = loginForm?.querySelectorAll("input");
  inputs?.forEach((input) => {
    input.addEventListener("input", hideError);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
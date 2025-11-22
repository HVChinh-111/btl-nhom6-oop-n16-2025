// ========== CONFIGURATION ==========
const API_BASE_URL = "http://localhost:8080/api";

// ========== DOM ELEMENTS ==========
const loginForm = document.querySelector(".form");
const loginError = document.getElementById("loginError");
const errorText = loginError?.querySelector(".form__error-text");

// ========== UTILITY FUNCTIONS ==========

// Show error message
function showError(message) {
  if (loginError && errorText) {
    errorText.textContent = message;
    loginError.style.display = "flex";
  }
}

// Hide error message
function hideError() {
  if (loginError) {
    loginError.style.display = "none";
  }
}

// Save auth data to localStorage
function saveAuthData(token, username, studentId, email) {
  localStorage.setItem("jwtToken", token);
  localStorage.setItem("username", username);
  localStorage.setItem("studentId", studentId);
  localStorage.setItem("email", email);
}

// ========== API CALLS ==========

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
      // Login successful
      if (data.token) {
        saveAuthData(data.token, data.username, data.studentId, data.email);
      }
      return { success: true, data };
    } else {
      // Login failed
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

// ========== EVENT HANDLERS ==========

async function handleLoginSubmit(e) {
  e.preventDefault();

  // Hide previous errors
  hideError();

  // Get form data
  const formData = new FormData(loginForm);
  const usernameOrEmail = formData.get("usernameOrEmail")?.trim();
  const password = formData.get("password");

  // Validate input
  if (!usernameOrEmail || !password) {
    showError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
    return;
  }

  // Disable submit button
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang đăng nhập...";

  try {
    // Call login API
    const result = await login(usernameOrEmail, password);

    if (result.success) {
      // Show success message
      showError("Đăng nhập thành công! Đang chuyển hướng...");
      loginError.style.backgroundColor = "#166534";
      loginError.style.borderColor = "#16a34a";

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      // Show error message
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

// ========== INITIALIZATION ==========

function init() {
  // Check if already logged in
  const token = localStorage.getItem("jwtToken");
  if (token) {
    // Redirect to home page if already logged in
    window.location.href = "index.html";
    return;
  }

  // Attach form submit handler
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Clear error on input
  const inputs = loginForm?.querySelectorAll("input");
  inputs?.forEach((input) => {
    input.addEventListener("input", hideError);
  });
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

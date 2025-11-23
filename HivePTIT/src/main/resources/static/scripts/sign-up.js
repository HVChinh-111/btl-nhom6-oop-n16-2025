// ========== CONFIGURATION ==========
const API_BASE_URL = "http://localhost:8080/api";

// ========== DOM ELEMENTS ==========
const signupForm = document.querySelector(".form");
const signupError = document.getElementById("signupError");
const errorText = signupError?.querySelector(".form__error-text");

// ========== UTILITY FUNCTIONS ==========

// Show error message
function showError(message) {
  if (signupError && errorText) {
    errorText.textContent = message;
    signupError.style.display = "flex";
    signupError.style.backgroundColor = "";
    signupError.style.borderColor = "";
  }
}

// Hide error message
function hideError() {
  if (signupError) {
    signupError.style.display = "none";
  }
}

// Show success message
function showSuccess(message) {
  if (signupError && errorText) {
    errorText.textContent = message;
    signupError.style.display = "flex";
    signupError.style.backgroundColor = "#166534";
    signupError.style.borderColor = "#16a34a";
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate PTIT email
function isValidPTITEmail(email) {
  return email.endsWith("@stu.ptit.edu.vn");
}

// Validate student ID format (10 characters)
function isValidStudentId(studentId) {
  return studentId.length === 10;
}

// ========== API CALLS ==========

async function signup(
  studentId,
  username,
  email,
  password,
  firstname,
  lastname
) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        username,
        email,
        password,
        firstname,
        lastname,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Signup successful
      return { success: true, data };
    } else {
      // Signup failed
      return {
        success: false,
        message: data.message || "Đăng ký thất bại. Vui lòng thử lại.",
      };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại sau.",
    };
  }
}

// ========== VALIDATION ==========

function validateForm(formData) {
  const studentId = formData.get("studentId")?.trim();
  const username = formData.get("username")?.trim();
  const email = formData.get("email")?.trim();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const lastname = formData.get("lastname")?.trim(); // Họ
  const firstname = formData.get("firstname")?.trim(); // Tên
  const acceptTerms = formData.get("acceptTerms");

  // Check all required fields
  if (!studentId || !username || !email || !password || !confirmPassword) {
    return {
      valid: false,
      message: "Vui lòng điền đầy đủ thông tin bắt buộc.",
    };
  }

  // Validate student ID
  if (!isValidStudentId(studentId)) {
    return { valid: false, message: "Mã sinh viên phải có đúng 10 ký tự." };
  }

  // Validate username length
  if (username.length < 3 || username.length > 30) {
    return { valid: false, message: "Tên người dùng phải có từ 3-30 ký tự." };
  }

  // Validate email
  if (!isValidEmail(email)) {
    return { valid: false, message: "Email không hợp lệ." };
  }

  if (!isValidPTITEmail(email)) {
    return { valid: false, message: "Email phải có đuôi @stu.ptit.edu.vn" };
  }

  // Validate password length
  if (password.length < 6 || password.length > 30) {
    return { valid: false, message: "Mật khẩu phải có từ 6-30 ký tự." };
  }

  // Check password match
  if (password !== confirmPassword) {
    return { valid: false, message: "Mật khẩu xác nhận không khớp." };
  }

  // Check terms acceptance
  if (!acceptTerms) {
    return { valid: false, message: "Bạn phải đồng ý với điều khoản sử dụng." };
  }

  return {
    valid: true,
    data: { studentId, username, email, password, firstname, lastname },
  };
}

// ========== EVENT HANDLERS ==========

async function handleSignupSubmit(e) {
  e.preventDefault();

  // Hide previous errors
  hideError();

  // Get form data
  const formData = new FormData(signupForm);

  // Validate form
  const validation = validateForm(formData);

  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  const { studentId, username, email, password, firstname, lastname } =
    validation.data;

  // Disable submit button
  const submitBtn = signupForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang đăng ký...";

  try {
    // Call signup API
    const result = await signup(
      studentId,
      username,
      email,
      password,
      firstname,
      lastname
    );

    if (result.success) {
      // Show success message
      showSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 2000);
    } else {
      // Show error message
      showError(result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error("Signup error:", error);
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
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignupSubmit);
  }

  // Clear error on input
  const inputs = signupForm?.querySelectorAll("input");
  inputs?.forEach((input) => {
    input.addEventListener("input", hideError);
  });

  // Real-time password match validation
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", () => {
      if (
        confirmPasswordInput.value &&
        passwordInput.value !== confirmPasswordInput.value
      ) {
        confirmPasswordInput.setCustomValidity("Mật khẩu không khớp");
      } else {
        confirmPasswordInput.setCustomValidity("");
      }
    });
  }
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

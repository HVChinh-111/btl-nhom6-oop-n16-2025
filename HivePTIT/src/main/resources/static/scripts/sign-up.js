const API_BASE_URL = "http://localhost:8080/api";

const signupForm = document.querySelector(".form");
const signupError = document.getElementById("signupError");
const errorText = signupError?.querySelector(".form__error-text");

function showError(message) {
  if (signupError && errorText) {
    errorText.textContent = message;
    signupError.style.display = "flex";
    signupError.style.backgroundColor = "";
    signupError.style.borderColor = "";
  }
}

function hideError() {
  if (signupError) {
    signupError.style.display = "none";
  }
}

function showSuccess(message) {
  if (signupError && errorText) {
    errorText.textContent = message;
    signupError.style.display = "flex";
    signupError.style.backgroundColor = "#22c55e";
    signupError.style.borderColor = "#22c55e";
    errorText.style.color = "#ffffff";
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPTITEmail(email) {
  return email.endsWith("@stu.ptit.edu.vn");
}

function isValidStudentId(studentId) {
  return studentId.length === 10;
}

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
      
      return { success: true, data };
    } else {
      
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

function validateForm(formData) {
  const studentId = formData.get("studentId")?.trim();
  const username = formData.get("username")?.trim();
  const email = formData.get("email")?.trim();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const lastname = formData.get("lastname")?.trim(); 
  const firstname = formData.get("firstname")?.trim(); 
  const acceptTerms = formData.get("acceptTerms");

  
  if (!studentId || !username || !email || !password || !confirmPassword) {
    return {
      valid: false,
      message: "Vui lòng điền đầy đủ thông tin bắt buộc.",
    };
  }

  
  if (!isValidStudentId(studentId)) {
    return { valid: false, message: "Mã sinh viên phải có đúng 10 ký tự." };
  }

  
  if (username.length < 3 || username.length > 30) {
    return { valid: false, message: "Tên người dùng phải có từ 3-30 ký tự." };
  }

  
  if (!isValidEmail(email)) {
    return { valid: false, message: "Email không hợp lệ." };
  }

  if (!isValidPTITEmail(email)) {
    return { valid: false, message: "Email phải có đuôi @stu.ptit.edu.vn" };
  }

  
  if (password.length < 6 || password.length > 30) {
    return { valid: false, message: "Mật khẩu phải có từ 6-30 ký tự." };
  }

  
  if (password !== confirmPassword) {
    return { valid: false, message: "Mật khẩu xác nhận không khớp." };
  }

  
  if (!acceptTerms) {
    return { valid: false, message: "Bạn phải đồng ý với điều khoản sử dụng." };
  }

  return {
    valid: true,
    data: { studentId, username, email, password, firstname, lastname },
  };
}

async function handleSignupSubmit(e) {
  e.preventDefault();

  
  hideError();

  
  const formData = new FormData(signupForm);

  
  const validation = validateForm(formData);

  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  const { studentId, username, email, password, firstname, lastname } =
    validation.data;

  
  const submitBtn = signupForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang đăng ký...";

  try {
    
    const result = await signup(
      studentId,
      username,
      email,
      password,
      firstname,
      lastname
    );

    if (result.success) {
      
      showSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");

      
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 2000);
    } else {
      
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

function init() {
  
  const token = localStorage.getItem("jwtToken");
  if (token) {
    
    window.location.href = "index.html";
    return;
  }

  
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignupSubmit);
  }

  
  const inputs = signupForm?.querySelectorAll("input");
  inputs?.forEach((input) => {
    input.addEventListener("input", hideError);
  });

  
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
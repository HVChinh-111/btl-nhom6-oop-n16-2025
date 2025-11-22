// ========== COMMON UTILITIES - Dùng chung cho tất cả các trang ==========

const API_BASE_URL = "http://localhost:8080/api";

// ========== AUTH UTILITIES ==========

// Lấy JWT token từ localStorage
function getAuthToken() {
  return localStorage.getItem("jwtToken") || localStorage.getItem("authToken");
}

// Lấy username từ localStorage
function getCurrentUsername() {
  return localStorage.getItem("username");
}

// Check authentication status
function checkAuth() {
  const token = getAuthToken();
  const username = getCurrentUsername();
  return !!(token && username);
}

// ========== LOGOUT FUNCTION ==========

async function logout() {
  console.log("Logout started");

  try {
    // Gọi API logout nếu có token
    const token = getAuthToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch((err) => console.log("Logout API error (ignored):", err));
    }
  } catch (error) {
    console.log("Logout API error (ignored):", error);
  }

  // Set flag TRƯỚC KHI xóa token
  sessionStorage.setItem("justLoggedOut", "true");

  // Xóa tất cả auth data
  localStorage.clear();

  console.log("All tokens cleared, redirecting to sign-in");

  // Redirect ngay lập tức
  window.location.replace("/sign-in");
}

// ========== FORMAT UTILITIES ==========

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Truncate text
function truncateText(text, maxLength = 200) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// ========== NAVIGATION UTILITIES ==========

// Navigate to Following feed (chuyển về trang index với feed "Đang theo dõi")
function navigateToFollowing() {
  // Kiểm tra xem đã đăng nhập chưa
  if (!checkAuth()) {
    alert("Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi.");
    return;
  }

  // Nếu đang ở trang index, reload với feedType=following
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index"
  ) {
    // Set state trong sessionStorage để index.js biết phải load following feed
    sessionStorage.setItem("feedType", "following");
    window.location.reload();
  } else {
    // Nếu ở trang khác, chuyển về trang index với param
    sessionStorage.setItem("feedType", "following");
    window.location.href = "/";
  }
}

// ========== INIT COMMON HANDLERS ==========

function initCommonHandlers() {
  // Handle logout button - tìm trong tất cả các trang
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Handle "Đang theo dõi" links - áp dụng cho tất cả trang
  const menuLinks = document.querySelectorAll(".header__menu-link");
  if (menuLinks[1]) {
    // Menu thứ 2 là "Đang theo dõi"
    menuLinks[1].addEventListener("click", (e) => {
      e.preventDefault();
      navigateToFollowing();
    });
  }

  // Có thể thêm các handlers chung khác ở đây
}

// Auto-init when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCommonHandlers);
} else {
  initCommonHandlers();
}

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

// ========== USER PROFILE UTILITIES ==========

// Fetch current user profile
async function fetchCurrentUserProfile() {
  const token = getAuthToken();
  const username = getCurrentUsername();

  if (!token || !username) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Render current user info in header dropdown
async function renderUserInfo() {
  const userMenu = document.querySelector(".header__user");

  if (!checkAuth()) {
    // User not logged in - show login button
    if (userMenu) {
      userMenu.innerHTML = `
        <a href="/sign-in" class="header__login-btn">Đăng nhập</a>
      `;
    }
    return;
  }

  const userProfile = await fetchCurrentUserProfile();
  if (!userProfile) {
    // Show login button on error
    if (userMenu) {
      userMenu.innerHTML = `
        <a href="/sign-in" class="header__login-btn">Đăng nhập</a>
      `;
    }
    return;
  }

  const headerAvatar = document.getElementById("headerAvatar");
  const userMenuAvatar = document.getElementById("userMenuAvatar");
  const userName = document.getElementById("userName");
  const userUsername = document.getElementById("userUsername");

  const fullName =
    userProfile.lastname && userProfile.firstname
      ? `${userProfile.lastname} ${userProfile.firstname}`
      : userProfile.username;

  // Update avatars
  if (headerAvatar) {
    headerAvatar.src = userProfile.avatarUrl || "/images/avatar.jpeg";
    headerAvatar.onerror = function () {
      this.src = "/images/avatar.jpeg";
    };
  }
  if (userMenuAvatar) {
    userMenuAvatar.src = userProfile.avatarUrl || "/images/avatar.jpeg";
    userMenuAvatar.onerror = function () {
      this.src = "/images/avatar.jpeg";
    };
  }

  // Update name and username
  if (userName) {
    userName.textContent = fullName;
  }
  if (userUsername) {
    userUsername.textContent = `@${userProfile.username}`;
  }
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

async function initCommonHandlers() {
  // Render user info in header dropdown (works on all pages)
  await renderUserInfo();

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

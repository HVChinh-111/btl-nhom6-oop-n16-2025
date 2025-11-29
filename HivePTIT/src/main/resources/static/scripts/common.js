const API_BASE_URL = "http://localhost:8080/api";

function getAuthToken() {
  return localStorage.getItem("jwtToken") || localStorage.getItem("authToken");
}

function getCurrentUsername() {
  return localStorage.getItem("username");
}

function checkAuth() {
  const token = getAuthToken();
  const username = getCurrentUsername();
  return !!(token && username);
}

async function logout() {
  console.log("Logout started");

  try {
    
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

  
  sessionStorage.setItem("justLoggedOut", "true");

  
  localStorage.clear();

  console.log("All tokens cleared, redirecting to sign-in");

  
  window.location.replace("/sign-in");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  
  if (diffInMinutes < 1) {
    return "Vừa xong";
  }
  
  else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

function truncateText(text, maxLength = 200) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

async function checkAdminRole() {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/test/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return false;
    const data = await response.json();
    
    const authorities = data.authorities || [];
    return authorities.some(
      (auth) =>
        auth.authority === "ROLE_Admin" || auth.authority === "ROLE_ADMIN"
    );
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

function updateTopicsMenuVisibility(isAdmin) {
  const topicsMenuItem = document.getElementById("topicsMenuItem");
  if (topicsMenuItem) {
    topicsMenuItem.style.display = isAdmin ? "block" : "none";
  }
}

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

async function renderUserInfo() {
  const userMenu = document.querySelector(".header__user");

  if (!checkAuth()) {
    
    if (userMenu) {
      userMenu.innerHTML = `
        <a href="/sign-in" class="header__login-btn">Đăng nhập</a>
      `;
    }
    return;
  }

  const userProfile = await fetchCurrentUserProfile();
  if (!userProfile) {
    
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

  
  if (userName) {
    userName.textContent = fullName;
  }
  if (userUsername) {
    userUsername.textContent = `@${userProfile.username}`;
  }
}

function navigateToFollowing() {
  
  if (!checkAuth()) {
    alert("Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi.");
    return;
  }

  
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index"
  ) {
    
    sessionStorage.setItem("feedType", "following");
    window.location.reload();
  } else {
    
    sessionStorage.setItem("feedType", "following");
    window.location.href = "/";
  }
}

async function initCommonHandlers() {
  
  await renderUserInfo();

  
  if (checkAuth()) {
    const isAdmin = await checkAdminRole();
    updateTopicsMenuVisibility(isAdmin);

    
    window.isCurrentUserAdmin = isAdmin;
  }

  
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  
  const menuLinks = document.querySelectorAll(".header__menu-link");
  if (menuLinks[1]) {
    
    menuLinks[1].addEventListener("click", (e) => {
      e.preventDefault();
      navigateToFollowing();
    });
  }

  
  const topicsLink = document.getElementById("topicsLink");
  if (topicsLink) {
    topicsLink.addEventListener("click", (e) => {
      e.preventDefault();
      
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/index"
      ) {
        
        if (typeof openTopicModal === "function") {
          openTopicModal();
        }
      } else {
        
        sessionStorage.setItem("openTopicsModal", "true");
        window.location.href = "/";
      }
    });
  }

  
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCommonHandlers);
} else {
  initCommonHandlers();
}
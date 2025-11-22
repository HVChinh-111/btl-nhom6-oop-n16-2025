// ========== CONSTANTS ==========
const API_BASE_URL = "http://localhost:8080/api";
const AUTHORS_PER_PAGE = 10;

// ========== STATE MANAGEMENT ==========
let currentPage = 0;
let totalPages = 0;
let totalAuthors = 0;
let currentUser = null;

// ========== UTILITY FUNCTIONS ==========
// Note: getAuthToken, getCurrentUsername, logout are now in common.js

// ========== API CALLS ==========

// Lấy thông tin user hiện tại
async function fetchCurrentUser() {
  const username = getCurrentUsername();
  if (!username) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Lấy danh sách authors với pagination
async function fetchLeaderboard(page = 0, size = AUTHORS_PER_PAGE) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/leaderboard?page=${page}&size=${size}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const data = await response.json();

    // Update pagination state
    currentPage = data.currentPage;
    totalPages = data.totalPages;
    totalAuthors = data.totalItems;

    return data.content || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

// ========== RENDER FUNCTIONS ==========

// Render header user info
function renderHeaderUserInfo(user) {
  if (!user) {
    // If not logged in, hide user menu and show login button
    const userMenu = document.querySelector(".header__user");
    if (userMenu) {
      userMenu.innerHTML = `
        <a href="/sign-in" class="header__login-btn">Đăng nhập</a>
      `;
    }
    return;
  }

  document.getElementById(
    "userName"
  ).textContent = `${user.firstname} ${user.lastname}`;
  document.getElementById("userUsername").textContent = `@${user.username}`;

  if (user.avatarUrl) {
    document.getElementById("headerAvatar").src = user.avatarUrl;
    document.getElementById("userMenuAvatar").src = user.avatarUrl;
  }
}

// Render podium (top 3)
function renderPodium(authors) {
  if (authors.length === 0) return;

  // Only show podium on first page
  const podiumSection = document.querySelector(".ranking__podium");
  if (currentPage === 0) {
    podiumSection.style.display = "block";

    // First place
    if (authors[0]) {
      const firstPlace = document.getElementById("firstPlace");
      renderPodiumItem(firstPlace, authors[0], 1);
    }

    // Second place
    if (authors[1]) {
      const secondPlace = document.getElementById("secondPlace");
      renderPodiumItem(secondPlace, authors[1], 2);
    }

    // Third place
    if (authors[2]) {
      const thirdPlace = document.getElementById("thirdPlace");
      renderPodiumItem(thirdPlace, authors[2], 3);
    }
  } else {
    podiumSection.style.display = "none";
  }
}

// Render single podium item
function renderPodiumItem(element, author, rank) {
  const avatar = element.querySelector(".podium__avatar");
  const name = element.querySelector(".podium__name");
  const username = element.querySelector(".podium__username");
  const studentId = element.querySelector(".podium__student-id");
  const statValue = element.querySelector(".podium__stat-value");

  if (avatar && author.avatarUrl) {
    avatar.src = author.avatarUrl;
  }
  if (name) {
    name.textContent = `${author.firstname} ${author.lastname}`;
  }
  if (username) {
    username.textContent = `@${author.username}`;
  }
  if (studentId) {
    studentId.textContent = author.studentId;
  }
  if (statValue) {
    statValue.textContent = author.rankingCore;
  }
}

// Render ranking table
function renderRankingTable(authors) {
  const tbody = document.getElementById("rankingTableBody");

  if (authors.length === 0) {
    tbody.innerHTML = `
      <tr class="ranking-table__row">
        <td colspan="8" class="ranking-table__empty">
          Không có dữ liệu
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = authors
    .map((author) => {
      const rank = author.rank; // Use global rank from backend
      const rowClass =
        rank <= 3
          ? `ranking-table__row ranking-table__row--top${rank}`
          : "ranking-table__row";

      return `
      <tr class="${rowClass}">
        <td class="ranking-table__td ranking-table__td--rank">${rank}</td>
        <td class="ranking-table__td ranking-table__td--avatar">
          <img
            src="${author.avatarUrl || "/images/avatar.jpeg"}"
            alt="${author.firstname} ${author.lastname}"
            class="ranking-table__avatar"
          />
        </td>
        <td class="ranking-table__td">
          <a href="/profile?username=${
            author.username
          }" class="ranking-table__link">
            ${author.username}
          </a>
        </td>
        <td class="ranking-table__td">${author.firstname}</td>
        <td class="ranking-table__td">${author.lastname}</td>
        <td class="ranking-table__td">${author.studentId}</td>
        <td class="ranking-table__td">${author.postCount}</td>
        <td class="ranking-table__td ranking-table__td--score">${
          author.rankingCore
        }</td>
      </tr>
    `;
    })
    .join("");
}

// Render pagination
function renderPagination() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = '<div class="pagination">';

  // Previous button
  if (currentPage > 0) {
    paginationHTML += `
      <button class="pagination__btn pagination__btn--prev" onclick="goToPage(${
        currentPage - 1
      })">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Trước
      </button>
    `;
  }

  // Page numbers with ellipsis
  const maxVisiblePages = 7;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  // First page
  if (startPage > 0) {
    paginationHTML += `
      <button class="pagination__btn ${
        currentPage === 0 ? "pagination__btn--active" : ""
      }" 
              onclick="goToPage(0)">1</button>
    `;
    if (startPage > 1) {
      paginationHTML += '<span class="pagination__ellipsis">...</span>';
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination__btn ${
        i === currentPage ? "pagination__btn--active" : ""
      }" 
              onclick="goToPage(${i})">${i + 1}</button>
    `;
  }

  // Last page
  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      paginationHTML += '<span class="pagination__ellipsis">...</span>';
    }
    paginationHTML += `
      <button class="pagination__btn ${
        currentPage === totalPages - 1 ? "pagination__btn--active" : ""
      }" 
              onclick="goToPage(${totalPages - 1})">${totalPages}</button>
    `;
  }

  // Next button
  if (currentPage < totalPages - 1) {
    paginationHTML += `
      <button class="pagination__btn pagination__btn--next" onclick="goToPage(${
        currentPage + 1
      })">
        Sau
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
  }

  paginationHTML += "</div>";
  paginationContainer.innerHTML = paginationHTML;
}

// ========== EVENT HANDLERS ==========

// Handle logout
document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

// Go to specific page
async function goToPage(page) {
  if (page < 0 || page >= totalPages) return;

  currentPage = page;
  await loadLeaderboard();

  // Scroll to top of table
  document.querySelector(".ranking__table-section")?.scrollIntoView({
    behavior: "smooth",
  });
}

// ========== MAIN FUNCTIONS ==========

// Load leaderboard data
async function loadLeaderboard() {
  const authors = await fetchLeaderboard(currentPage, AUTHORS_PER_PAGE);

  if (authors.length > 0) {
    renderPodium(authors);
    renderRankingTable(authors);
    renderPagination();
  } else {
    // Show error or empty state
    const tbody = document.getElementById("rankingTableBody");
    tbody.innerHTML = `
      <tr class="ranking-table__row">
        <td colspan="8" class="ranking-table__empty">
          Không thể tải dữ liệu bảng xếp hạng
        </td>
      </tr>
    `;
  }
}

// Initialize ranking page
async function initRanking() {
  // Try to fetch current user info (optional - public page)
  const token = getAuthToken();
  if (token) {
    currentUser = await fetchCurrentUser();
  }

  // Render header (with or without user)
  renderHeaderUserInfo(currentUser);

  // Load leaderboard
  await loadLeaderboard();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initRanking);

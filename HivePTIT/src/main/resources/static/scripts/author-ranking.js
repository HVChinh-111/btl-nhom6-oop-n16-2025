// ========== CONSTANTS ==========
const API_BASE_URL = "http://localhost:8080/api";
const TOP_AUTHORS_COUNT = 10;

// ========== STATE MANAGEMENT ==========
let allAuthors = [];
let currentUser = null;

// ========== UTILITY FUNCTIONS ==========

// Lấy token từ localStorage
function getAuthToken() {
  return localStorage.getItem("authToken") || localStorage.getItem("jwtToken");
}

// Lấy username từ localStorage
function getCurrentUsername() {
  return localStorage.getItem("username");
}

// Logout
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
  window.location.href = "sign-in.html";
}

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

// Lấy danh sách top authors (giả sử từ feed hoặc tạo endpoint mới)
// Vì chưa có API riêng cho ranking, tôi sẽ fetch nhiều users và sort
async function fetchTopAuthors() {
  try {
    // Tạm thời sử dụng cách này: fetch posts và lấy unique authors
    const homeFeedResponse = await fetch(
      `${API_BASE_URL}/feed/home?page=0&size=100`
    );

    if (!homeFeedResponse.ok) {
      throw new Error("Failed to fetch posts");
    }

    const feedData = await homeFeedResponse.json();
    const posts = feedData.content || feedData;

    // Extract unique authors và tính toán stats
    const authorsMap = new Map();

    posts.forEach((post) => {
      const author = post.author;
      if (!authorsMap.has(author.username)) {
        authorsMap.set(author.username, {
          username: author.username,
          firstname: author.firstname,
          lastname: author.lastname,
          studentId: author.studentId || "N/A",
          avatarUrl: author.avatarUrl,
          rankingCore: author.rankingCore || 0,
          postCount: 1,
        });
      } else {
        const existing = authorsMap.get(author.username);
        existing.postCount += 1;
      }
    });

    // Convert map to array and sort by rankingCore
    const authors = Array.from(authorsMap.values());
    authors.sort((a, b) => b.rankingCore - a.rankingCore);

    return authors.slice(0, TOP_AUTHORS_COUNT);
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return [];
  }
}

// ========== RENDER FUNCTIONS ==========

// Render header user info
function renderHeaderUserInfo(user) {
  if (!user) return;

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
    .map((author, index) => {
      const rank = index + 1;
      const rowClass =
        rank <= 3
          ? `ranking-table__row ranking-table__row--top${rank}`
          : "ranking-table__row";

      return `
      <tr class="${rowClass}">
        <td class="ranking-table__td ranking-table__td--rank">${rank}</td>
        <td class="ranking-table__td ranking-table__td--avatar">
          <img
            src="${author.avatarUrl || "../static/images/avatar.jpeg"}"
            alt="${author.firstname} ${author.lastname}"
            class="ranking-table__avatar"
          />
        </td>
        <td class="ranking-table__td">
          <a href="profile.html?username=${
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

// ========== EVENT HANDLERS ==========

// Handle logout
document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

// ========== MAIN FUNCTIONS ==========

// Initialize ranking page
async function initRanking() {
  // Check if user is logged in
  const token = getAuthToken();
  if (!token) {
    window.location.href = "sign-in.html";
    return;
  }

  // Fetch current user info
  currentUser = await fetchCurrentUser();
  if (currentUser) {
    renderHeaderUserInfo(currentUser);
  }

  // Fetch and render top authors
  allAuthors = await fetchTopAuthors();

  if (allAuthors.length > 0) {
    renderPodium(allAuthors);
    renderRankingTable(allAuthors);
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", initRanking);

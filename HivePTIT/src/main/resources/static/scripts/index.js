// ========== CONFIGURATION & STATE ==========
const POSTS_PER_PAGE = 10;

let currentState = {
  posts: [],
  currentPage: 1,
  totalPages: 0,
  totalPosts: 0,
  feedType: "home", // 'home', 'following', 'topic'
  selectedTopic: null,
  isAuthenticated: false,
  currentUser: null,
};

// ========== UTILITY FUNCTIONS ==========
// Note: getAuthToken, getCurrentUsername, checkAuth, formatDate, truncateText
// are now in common.js

// ========== API CALLS ==========

// Fetch home feed (all posts)
async function fetchHomeFeed(page = 0, size = POSTS_PER_PAGE) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/feed/home?page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Failed to fetch home feed");
    return await response.json();
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return [];
  }
}

// Fetch following feed (requires auth)
async function fetchFollowingFeed(page = 0, size = POSTS_PER_PAGE) {
  const token = getAuthToken();
  if (!token) {
    console.warn("Not authenticated - cannot fetch following feed");
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/feed/following?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch following feed");
    return await response.json();
  } catch (error) {
    console.error("Error fetching following feed:", error);
    return [];
  }
}

// Fetch posts by topic
async function fetchPostsByTopic(topicName, page = 0, size = POSTS_PER_PAGE) {
  try {
    // Note: API documentation doesn't specify topic filtering endpoint
    // Using home feed and filtering client-side for now
    const allPosts = await fetchHomeFeed(0, 1000); // Get more posts for filtering
    const filtered = allPosts.filter(
      (post) =>
        post.topics &&
        post.topics.some((t) => t.toLowerCase() === topicName.toLowerCase())
    );

    // Paginate filtered results
    const start = page * size;
    const end = start + size;
    return filtered.slice(start, end);
  } catch (error) {
    console.error("Error fetching posts by topic:", error);
    return [];
  }
}

// Fetch all topics
async function fetchTopics() {
  try {
    const response = await fetch(`${API_BASE_URL}/topics`);
    if (!response.ok) throw new Error("Failed to fetch topics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

// Fetch trending posts
async function fetchTrendingPosts(limit = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/feed/trending`);
    if (!response.ok) throw new Error("Failed to fetch trending posts");
    const posts = await response.json();
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
}

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

// Fetch top authors (sorted by ranking score)
async function fetchTopAuthors(limit = 5) {
  try {
    // Since API doesn't have dedicated top authors endpoint,
    // we'll fetch home feed and extract unique authors, sorted by rankingCore
    const posts = await fetch(`${API_BASE_URL}/feed/home?page=0&size=100`)
      .then((res) => res.json())
      .catch(() => []);

    // Extract unique authors and sort by rankingCore
    const authorsMap = new Map();
    posts.forEach((post) => {
      if (!authorsMap.has(post.authorUsername)) {
        authorsMap.set(post.authorUsername, {
          username: post.authorUsername,
          firstname: post.authorFirstname,
          lastname: post.authorLastname,
          avatarUrl: post.authorAvatarUrl,
          rankingCore: 0, // We'll need to get this from user profile
          postCount: 1,
        });
      } else {
        const author = authorsMap.get(post.authorUsername);
        author.postCount++;
      }
    });

    // Convert to array and sort by post count (as proxy for ranking)
    const authors = Array.from(authorsMap.values())
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);

    return authors;
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return [];
  }
}

// ========== RENDER FUNCTIONS ==========

// Render a single post
function renderPost(post) {
  const topicsHTML =
    post.topics && post.topics.length > 0
      ? post.topics
          .map((topic) => `<span class="post__tag">${topic}</span>`)
          .join("")
      : "";

  const authorName =
    post.authorFirstname && post.authorLastname
      ? `${post.authorFirstname} ${post.authorLastname}`
      : post.authorUsername;

  const avatarUrl = post.authorAvatarUrl || "/images/avatar.jpeg";

  return `
    <article class="post" data-post-id="${post.postId}">
      <div class="post__tags">
        ${topicsHTML}
      </div>
      <h2 class="post__title">
        <a href="/post?id=${post.postId}" class="post__title-link">
          ${post.title}
        </a>
      </h2>
      <div class="post__meta">
        <div class="post__author">
          <img
            src="${avatarUrl}"
            alt="${authorName}"
            class="post__author-avatar"
          />
          <div class="post__author-info">
            <a href="/profile?username=${
              post.authorUsername
            }" class="post__author-name">
              ${authorName}
            </a>
            <time class="post__date" datetime="${post.createdAt}">
              ${formatDate(post.createdAt)}
            </time>
          </div>
        </div>
        <div class="post__stats">
          <span class="post__stat">
            <svg viewBox="0 0 20 20" width="16" height="16">
              <path
                fill="currentColor"
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
            ${post.voteCount || 0}
          </span>
          <span class="post__stat">
            <svg viewBox="0 0 20 20" width="16" height="16">
              <path
                fill="currentColor"
                d="M10 20c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-1-5h2v2h-2v-2zm0-8h2v6h-2v-6z"
              />
            </svg>
            ${post.commentCount || 0}
          </span>
        </div>
      </div>
      <p class="post__excerpt">
        ${truncateText(post.content, 200)}
      </p>
      <a href="/post?id=${post.postId}" class="post__read-more">Đọc thêm</a>
    </article>
  `;
}

// Render all posts
function renderPosts(posts) {
  const postsContainer = document.querySelector(".posts");
  if (!postsContainer) return;

  if (posts.length === 0) {
    postsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <p>Không có bài viết nào.</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML = posts.map((post) => renderPost(post)).join("");
}

// Render pagination
function renderPagination() {
  const paginationPages = document.querySelector(".pagination__pages");
  if (!paginationPages) return;

  const { currentPage, totalPages } = currentState;

  if (totalPages === 0) {
    paginationPages.innerHTML = "";
    updatePaginationButtons();
    return;
  }

  let pagesHTML = "";

  if (totalPages <= 6) {
    // Show all pages if 6 or fewer
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? "pagination__page--active" : "";
      pagesHTML += `<button class="pagination__page ${activeClass}" data-page="${i}">${i}</button>`;
    }
  } else {
    // Show pages with ellipsis
    pagesHTML += `<button class="pagination__page ${
      currentPage === 1 ? "pagination__page--active" : ""
    }" data-page="1">1</button>`;

    if (currentPage > 3) {
      pagesHTML += `<span class="pagination__ellipsis">...</span>`;
    }

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === currentPage ? "pagination__page--active" : "";
      pagesHTML += `<button class="pagination__page ${activeClass}" data-page="${i}">${i}</button>`;
    }

    if (currentPage < totalPages - 2) {
      pagesHTML += `<span class="pagination__ellipsis">...</span>`;
    }

    const lastActiveClass =
      currentPage === totalPages ? "pagination__page--active" : "";
    pagesHTML += `<button class="pagination__page ${lastActiveClass}" data-page="${totalPages}">${totalPages}</button>`;
  }

  paginationPages.innerHTML = pagesHTML;

  // Attach event listeners to page buttons
  document.querySelectorAll(".pagination__page").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"));
      goToPage(page);
    });
  });

  updatePaginationButtons();
}

// Update prev/next buttons
function updatePaginationButtons() {
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  const nextBtn = document.querySelector(".pagination__btn:last-child");

  if (!prevBtn || !nextBtn) return;

  const { currentPage, totalPages } = currentState;

  // Previous button
  if (currentPage === 1 || totalPages === 0) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  // Next button
  if (currentPage === totalPages || totalPages === 0) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }
}

// ========== NAVIGATION FUNCTIONS ==========

// Go to specific page
async function goToPage(page) {
  currentState.currentPage = page;
  await loadPosts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Load posts based on current state
async function loadPosts() {
  const { feedType, selectedTopic, currentPage } = currentState;
  let posts = [];

  // Show loading state
  const postsContainer = document.querySelector(".posts");
  if (postsContainer) {
    postsContainer.innerHTML =
      '<div style="text-align: center; padding: 40px;">Đang tải...</div>';
  }

  try {
    if (feedType === "home") {
      posts = await fetchHomeFeed(currentPage - 1, POSTS_PER_PAGE);
    } else if (feedType === "following") {
      if (!checkAuth()) {
        alert("Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi.");
        switchToHomeFeed();
        return;
      }
      posts = await fetchFollowingFeed(currentPage - 1, POSTS_PER_PAGE);
    } else if (feedType === "topic" && selectedTopic) {
      posts = await fetchPostsByTopic(
        selectedTopic,
        currentPage - 1,
        POSTS_PER_PAGE
      );
    }

    currentState.posts = posts;

    // Calculate total pages (simplified - assuming we get all posts for now)
    // Note: API should return pagination info, but based on current API structure
    if (posts.length < POSTS_PER_PAGE) {
      currentState.totalPages = currentPage;
    } else {
      // Estimate - we'd need total count from API
      currentState.totalPages = currentPage + 1;
    }

    renderPosts(posts);
    renderPagination();
  } catch (error) {
    console.error("Error loading posts:", error);
    if (postsContainer) {
      postsContainer.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #dc2626;">Có lỗi xảy ra khi tải bài viết.</div>';
    }
  }
}

// Switch to home feed
function switchToHomeFeed() {
  currentState.feedType = "home";
  currentState.selectedTopic = null;
  currentState.currentPage = 1;
  loadPosts();

  // Update active menu
  updateActiveMenu("home");
}

// Switch to following feed
function switchToFollowingFeed() {
  if (!checkAuth()) {
    alert("Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi.");
    return;
  }

  currentState.feedType = "following";
  currentState.selectedTopic = null;
  currentState.currentPage = 1;
  loadPosts();

  // Update active menu
  updateActiveMenu("following");
}

// Switch to topic feed
function switchToTopicFeed(topicName) {
  currentState.feedType = "topic";
  currentState.selectedTopic = topicName;
  currentState.currentPage = 1;
  loadPosts();

  // Update active menu
  updateActiveMenu("topic");
}

// Update active menu highlighting
function updateActiveMenu(activeItem) {
  const menuLinks = document.querySelectorAll(".header__menu-link");
  menuLinks.forEach((link) => {
    link.classList.remove("header__menu-link--active");
  });

  if (activeItem === "home") {
    const homeLink = document.querySelector(
      '.header__menu-link[href="index.html"]'
    );
    if (homeLink) homeLink.classList.add("header__menu-link--active");
  } else if (activeItem === "following") {
    const followingLink = document.querySelectorAll(".header__menu-link")[1]; // Second menu item
    if (followingLink) followingLink.classList.add("header__menu-link--active");
  }
}

// ========== RENDER SIDEBAR COMPONENTS ==========

// Render current user info in header
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
    userProfile.firstname && userProfile.lastname
      ? `${userProfile.firstname} ${userProfile.lastname}`
      : userProfile.username;

  // Update avatars
  if (headerAvatar && userProfile.avatarUrl) {
    headerAvatar.src = userProfile.avatarUrl;
  }
  if (userMenuAvatar && userProfile.avatarUrl) {
    userMenuAvatar.src = userProfile.avatarUrl;
  }

  // Update name and username
  if (userName) {
    userName.textContent = fullName;
  }
  if (userUsername) {
    userUsername.textContent = `@${userProfile.username}`;
  }
}

// Render top authors in sidebar
async function renderTopAuthors() {
  const authors = await fetchTopAuthors(5);
  const topAuthorsContainer = document.querySelector(".top-authors__list");

  if (!topAuthorsContainer) return;

  if (authors.length === 0) {
    topAuthorsContainer.innerHTML =
      '<p style="text-align: center; color: #666;">Chưa có dữ liệu</p>';
    return;
  }

  topAuthorsContainer.innerHTML = authors
    .map((author, index) => {
      const fullName =
        author.firstname && author.lastname
          ? `${author.lastname} ${author.firstname}`
          : author.username;
      const avatarUrl = author.avatarUrl || "../static/images/avatar.jpeg";

      return `
      <div class="top-authors__item">
        <span class="top-authors__rank">${index + 1}</span>
        <img src="${avatarUrl}" 
             alt="${fullName}" 
             class="top-authors__avatar" />
        <div class="top-authors__info">
           <a href="/profile?username=${author.username}" 
             class="top-authors__name">${fullName}</a>
          <p class="top-authors__stats">${author.postCount} bài viết</p>
        </div>
      </div>
    `;
    })
    .join("");
}

// Render trending posts in sidebar
async function renderTrendingPosts() {
  const trendingPosts = await fetchTrendingPosts(5);
  const trendingContainer = document.querySelector(".trending__list");

  if (!trendingContainer) return;

  if (trendingPosts.length === 0) {
    trendingContainer.innerHTML =
      '<p style="text-align: center; color: #666;">Chưa có bài viết trending</p>';
    return;
  }

  trendingContainer.innerHTML = trendingPosts
    .map((post) => {
      const authorName =
        post.authorFirstname && post.authorLastname
          ? `${post.authorLastname} ${post.authorFirstname}`
          : post.authorUsername;

      return `
      <div class="trending__item">
        <a href="/post?id=${post.postId}" class="trending__title">
          ${post.title}
        </a>
        <div class="trending__meta">
          <span class="trending__author">${authorName}</span>
          <span class="trending__stats">
            ${post.voteCount || 0} votes • ${post.commentCount || 0} comments
          </span>
        </div>
      </div>
    `;
    })
    .join("");
}

// Render topics in sidebar with post counts
async function renderTopicsSidebar() {
  const topics = await fetchTopics();
  const allPosts = await fetchHomeFeed(0, 1000); // Get many posts to count
  const topicsContainer = document.querySelector(".topics__list");

  if (!topicsContainer) return;

  if (topics.length === 0) {
    topicsContainer.innerHTML =
      '<p style="text-align: center; color: #666;">Chưa có chủ đề</p>';
    return;
  }

  // Count posts per topic
  const topicCounts = {};
  topics.forEach((topic) => {
    topicCounts[topic.name] = 0;
  });

  allPosts.forEach((post) => {
    if (post.topics && Array.isArray(post.topics)) {
      post.topics.forEach((topicName) => {
        if (topicCounts.hasOwnProperty(topicName)) {
          topicCounts[topicName]++;
        }
      });
    }
  });

  topicsContainer.innerHTML = topics
    .map((topic) => {
      const postCount = topicCounts[topic.name] || 0;

      return `
      <li class="topics__item">
        <a href="#" class="topics__link" data-topic="${topic.name}">
          <span class="topics__name">${topic.name}</span>
          <span class="topics__count">${postCount}</span>
        </a>
      </li>
    `;
    })
    .join("");

  // Attach event listeners
  document.querySelectorAll(".topics__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const topicName = link.getAttribute("data-topic");
      switchToTopicFeed(topicName);
    });
  });
}

// ========== EVENT LISTENERS ==========

function initEventListeners() {
  // Home link
  const homeLink = document.querySelector(
    '.header__menu-link[href="index.html"]'
  );
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchToHomeFeed();
    });
  }

  // Note: "Đang theo dõi" link được xử lý chung trong common.js

  // Previous page button
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentState.currentPage > 1) {
        goToPage(currentState.currentPage - 1);
      }
    });
  }

  // Next page button
  const nextBtn = document.querySelector(".pagination__btn:last-child");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentState.currentPage < currentState.totalPages) {
        goToPage(currentState.currentPage + 1);
      }
    });
  }
}

// ========== INITIALIZATION ==========

async function init() {
  console.log("Initializing HivePTIT Index...");

  // Check authentication (from common.js)
  currentState.isAuthenticated = checkAuth();
  currentState.currentUser = getCurrentUsername();

  // Kiểm tra xem có yêu cầu load following feed từ sessionStorage không
  const requestedFeedType = sessionStorage.getItem("feedType");
  if (requestedFeedType === "following") {
    currentState.feedType = "following";
    sessionStorage.removeItem("feedType"); // Clear sau khi đọc
  }

  // Initialize event listeners
  initEventListeners();

  // Render user info in header
  await renderUserInfo();

  // Render sidebar components
  await Promise.all([
    renderTopAuthors(),
    renderTrendingPosts(),
    renderTopicsSidebar(),
  ]);

  // Load initial posts (sẽ load theo feedType đã set)
  await loadPosts();

  // Update active menu nếu là following feed
  if (currentState.feedType === "following") {
    updateActiveMenu("following");
  }

  console.log("HivePTIT Index initialized successfully");
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

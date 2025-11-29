const POSTS_PER_PAGE = 10;

let currentState = {
  posts: [],
  currentPage: 1,
  totalPages: 0,
  totalPosts: 0,
  feedType: "home", 
  selectedTopic: null,
  searchKeyword: null,
  isAuthenticated: false,
  currentUser: null,
  isAdmin: false,
};

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

async function fetchPostsByTopic(topicName, page = 0, size = POSTS_PER_PAGE) {
  try {
    
    
    const allPosts = await fetchHomeFeed(0, 1000); 
    const filtered = allPosts.filter(
      (post) =>
        post.topics &&
        post.topics.some((t) => t.toLowerCase() === topicName.toLowerCase())
    );

    
    const start = page * size;
    const end = start + size;
    return filtered.slice(start, end);
  } catch (error) {
    console.error("Error fetching posts by topic:", error);
    return [];
  }
}

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

async function searchPosts(keyword, page = 0, size = POSTS_PER_PAGE) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/posts?q=${encodeURIComponent(
        keyword
      )}&page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Failed to search posts");
    return await response.json();
  } catch (error) {
    console.error("Error searching posts:", error);
    return { content: [], totalPages: 0, totalElements: 0 };
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

async function fetchTopAuthors(limit = 5) {
  try {
    
    const response = await fetch(
      `${API_BASE_URL}/leaderboard?page=0&size=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch top authors");
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return [];
  }
}

function renderPost(post) {
  
  let topicsArray = [];
  if (post.topics && Array.isArray(post.topics)) {
    topicsArray = post.topics.map((topic) =>
      typeof topic === "string" ? topic : topic.name
    );
  }

  const topicsHTML = topicsArray
    .map(
      (topic, index) => `
      <span class="post__tag post__tag--${
        ["blue", "teal", "purple", "blue-light"][index % 4]
      }">
        ${topic}
      </span>
    `
    )
    .join("");

  
  let authorName, authorUsername, avatarUrl;

  if (post.author) {
    
    authorName =
      post.author.lastname && post.author.firstname
        ? `${post.author.lastname} ${post.author.firstname}`
        : post.author.username;
    authorUsername = post.author.username;
    avatarUrl = post.author.avatarUrl || "/images/avatar.jpeg";
  } else {
    
    authorName =
      post.authorLastname && post.authorFirstname
        ? `${post.authorLastname} ${post.authorFirstname}`
        : post.authorUsername;
    authorUsername = post.authorUsername;
    avatarUrl = post.authorAvatarUrl || "/images/avatar.jpeg";
  }

  
  const postId = post.id || post.postId;

  
  
  const showActions = currentState.isAdmin;

  const actionsMenuHTML = showActions
    ? `
    <div class="post__actions">
      <button class="post__actions-btn" onclick="togglePostMenu(${postId})">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
        </svg>
      </button>
      <div class="post__actions-menu" id="post-menu-${postId}">
        <button class="post__actions-item post__actions-item--danger" onclick="deletePost(${postId})">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H14M5 4V2H11V4M6 7V12M10 7V12M3 4L4 14H12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Xóa bài viết
        </button>
      </div>
    </div>
  `
    : "";

  return `
    <article class="post">
      <div class="post__header">
        ${topicsHTML ? `<div class="post__tags">${topicsHTML}</div>` : ""}
        ${actionsMenuHTML}
      </div>
      <h3 class="post__title">
        <a href="/post?id=${postId}" class="post__title-link">
          ${post.title}
        </a>
      </h3>
      <div class="post__meta">
        <img
          src="${avatarUrl}"
          alt="${authorName}"
          class="post__author-avatar"
          onerror="this.src='/images/avatar.jpeg'"
        />
        <a href="/profile?username=${authorUsername}" class="post__author">
          ${authorName}
        </a>
        <span class="post__date">
          <svg
            class="post__date-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M8 4V8L10.5 9.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          ${formatDate(post.createdAt)}
        </span>
      </div>
      <p class="post__excerpt">
        ${post.content.substring(0, 200)}${
    post.content.length > 200 ? "..." : ""
  }
      </p>
      <a href="/post?id=${postId}" class="post__read-more">
        Đọc thêm
      </a>
    </article>
  `;
}

function togglePostMenu(postId) {
  const menu = document.getElementById(`post-menu-${postId}`);
  if (menu) {
    
    document.querySelectorAll(".post__actions-menu").forEach((m) => {
      if (m.id !== `post-menu-${postId}`) {
        m.classList.remove("post__actions-menu--active");
      }
    });
    menu.classList.toggle("post__actions-menu--active");
  }
}

async function deletePost(postId) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

  const token = getAuthToken();
  if (!token) {
    alert("Vui lòng đăng nhập để thực hiện thao tác này.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok || response.status === 204) {
      alert("Đã xóa bài viết thành công!");
      loadPosts(); 
    } else {
      const error = await response.json().catch(() => ({}));
      alert(error.message || "Không thể xóa bài viết. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Có lỗi xảy ra khi xóa bài viết.");
  }
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".post__actions")) {
    document.querySelectorAll(".post__actions-menu").forEach((menu) => {
      menu.classList.remove("post__actions-menu--active");
    });
  }
});

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

function renderSearchResults(posts, keyword) {
  const postsContainer = document.querySelector(".posts");
  if (!postsContainer) return;

  const headerHTML = `
    <div class="search-results-header" style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>Kết quả tìm kiếm cho:</strong> "${keyword}" 
          <span style="color: #6b7280;">(${currentState.totalPosts} bài viết)</span>
        </p>
        <button onclick="clearSearch()" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
          ✕ Xóa tìm kiếm
        </button>
      </div>
    </div>
  `;

  if (posts.length === 0) {
    postsContainer.innerHTML =
      headerHTML +
      `
      <div style="text-align: center; padding: 40px; color: #666;">
        <p>Không tìm thấy bài viết nào phù hợp với từ khóa "${keyword}".</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML =
    headerHTML + posts.map((post) => renderPost(post)).join("");
}

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
    
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? "pagination__page--active" : "";
      pagesHTML += `<button class="pagination__page ${activeClass}" data-page="${i}">${i}</button>`;
    }
  } else {
    
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

  
  document.querySelectorAll(".pagination__page").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"));
      goToPage(page);
    });
  });

  updatePaginationButtons();
}

function updatePaginationButtons() {
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  const nextBtn = document.querySelector(".pagination__btn:last-child");

  if (!prevBtn || !nextBtn) return;

  const { currentPage, totalPages } = currentState;

  
  if (currentPage === 1 || totalPages === 0) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  
  if (currentPage === totalPages || totalPages === 0) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }
}

async function goToPage(page) {
  currentState.currentPage = page;
  await loadPosts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadPosts() {
  const { feedType, selectedTopic, searchKeyword, currentPage } = currentState;
  let posts = [];

  
  const postsContainer = document.querySelector(".posts");
  if (postsContainer) {
    postsContainer.innerHTML =
      '<div style="text-align: center; padding: 40px;">Đang tải...</div>';
  }

  try {
    if (feedType === "search" && searchKeyword) {
      
      const searchResult = await searchPosts(
        searchKeyword,
        currentPage - 1,
        POSTS_PER_PAGE
      );
      posts = searchResult.content || [];
      currentState.totalPages = searchResult.totalPages || 0;
      currentState.totalPosts = searchResult.totalElements || 0;
    } else if (feedType === "home") {
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

    
    if (feedType !== "search") {
      if (posts.length < POSTS_PER_PAGE) {
        currentState.totalPages = currentPage;
      } else {
        currentState.totalPages = currentPage + 1;
      }
    }

    
    if (feedType === "search") {
      renderSearchResults(posts, searchKeyword);
    } else {
      renderPosts(posts);
    }
    renderPagination();
  } catch (error) {
    console.error("Error loading posts:", error);
    if (postsContainer) {
      postsContainer.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #dc2626;">Có lỗi xảy ra khi tải bài viết.</div>';
    }
  }
}

function switchToHomeFeed() {
  currentState.feedType = "home";
  currentState.selectedTopic = null;
  currentState.searchKeyword = null;
  currentState.currentPage = 1;

  
  const searchInput = document.querySelector(".search__input");
  if (searchInput) searchInput.value = "";

  loadPosts();

  
  updateActiveMenu("home");
}

function clearSearch() {
  switchToHomeFeed();
}

function performSearch() {
  const searchInput = document.querySelector(".search__input");
  if (!searchInput) return;

  const keyword = searchInput.value.trim();
  if (!keyword) {
    return;
  }

  currentState.feedType = "search";
  currentState.searchKeyword = keyword;
  currentState.selectedTopic = null;
  currentState.currentPage = 1;

  
  updateActiveMenu("search");

  loadPosts();
}

function switchToFollowingFeed() {
  if (!checkAuth()) {
    alert("Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi.");
    return;
  }

  currentState.feedType = "following";
  currentState.selectedTopic = null;
  currentState.searchKeyword = null;
  currentState.currentPage = 1;

  
  const searchInput = document.querySelector(".search__input");
  if (searchInput) searchInput.value = "";

  loadPosts();

  
  updateActiveMenu("following");
}

function switchToTopicFeed(topicName) {
  currentState.feedType = "topic";
  currentState.selectedTopic = topicName;
  currentState.currentPage = 1;
  loadPosts();

  
  updateActiveMenu("topic");

  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateActiveMenu(activeItem) {
  const menuLinks = document.querySelectorAll(".header__menu-link");
  menuLinks.forEach((link) => {
    link.classList.remove("header__menu-link--active");
  });

  if (activeItem === "home") {
    const homeLink = document.querySelector('.header__menu-link[href="/"]');
    if (homeLink) homeLink.classList.add("header__menu-link--active");
  } else if (activeItem === "following") {
    const followingLink = document.querySelectorAll(".header__menu-link")[1]; 
    if (followingLink) followingLink.classList.add("header__menu-link--active");
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

  
  if (headerAvatar && userProfile.avatarUrl) {
    headerAvatar.src = userProfile.avatarUrl;
  }
  if (userMenuAvatar && userProfile.avatarUrl) {
    userMenuAvatar.src = userProfile.avatarUrl;
  }

  
  if (userName) {
    userName.textContent = fullName;
  }
  if (userUsername) {
    userUsername.textContent = `@${userProfile.username}`;
  }
}

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
        author.lastname && author.firstname
          ? `${author.lastname} ${author.firstname}`
          : author.username;
      const avatarUrl = author.avatarUrl || "/images/avatar.jpeg";

      return `
      <div class="top-authors__item">
        <span class="top-authors__rank">${index + 1}</span>
        <img src="${avatarUrl}" 
             alt="${fullName}" 
             class="top-authors__avatar"
             onerror="this.src='/images/avatar.jpeg'" />
        <div class="top-authors__info">
           <a href="/profile?username=${author.username}" 
             class="top-authors__name">${fullName}</a>
          <p class="top-authors__stats">${author.rankingCore || 0} điểm</p>
        </div>
      </div>
    `;
    })
    .join("");
}

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
        post.authorLastname && post.authorFirstname
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

async function renderTopicsSidebar() {
  const topics = await fetchTopics();
  const allPosts = await fetchHomeFeed(0, 1000); 
  const topicsContainer = document.querySelector(".topics__list");

  if (!topicsContainer) return;

  if (topics.length === 0) {
    topicsContainer.innerHTML =
      '<p style="text-align: center; color: #666;">Chưa có chủ đề</p>';
    return;
  }

  
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

  
  document.querySelectorAll(".topics__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const topicName = link.getAttribute("data-topic");
      switchToTopicFeed(topicName);
    });
  });
}

function initEventListeners() {
  
  const homeLink = document.querySelector('.header__menu-link[href="/"]');
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchToHomeFeed();
    });
  }

  

  
  const searchInput = document.querySelector(".search__input");
  const searchBtn = document.querySelector(".search__btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      performSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }

  
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentState.currentPage > 1) {
        goToPage(currentState.currentPage - 1);
      }
    });
  }

  
  const nextBtn = document.querySelector(".pagination__btn:last-child");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentState.currentPage < currentState.totalPages) {
        goToPage(currentState.currentPage + 1);
      }
    });
  }
}

let selectedTopicId = null;

function openTopicModal() {
  const modal = document.getElementById("topicModal");
  if (modal) {
    modal.style.display = "flex";
    loadTopicsForModal();
  }
}

function closeTopicModal() {
  const modal = document.getElementById("topicModal");
  if (modal) {
    modal.style.display = "none";
    selectedTopicId = null;
    updateDeleteTopicButton();
    
    const input = document.getElementById("newTopicName");
    if (input) input.value = "";
  }
}

async function fetchAllTopics() {
  try {
    const response = await fetch(`${API_BASE_URL}/topics`);
    if (!response.ok) throw new Error("Failed to fetch topics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

async function loadTopicsForModal() {
  const topicList = document.getElementById("topicList");
  if (!topicList) return;

  topicList.innerHTML = '<div class="topic-modal__loading">Đang tải...</div>';

  const topics = await fetchAllTopics();

  if (topics.length === 0) {
    topicList.innerHTML =
      '<div class="topic-modal__empty">Chưa có topic nào</div>';
    return;
  }

  topicList.innerHTML = topics
    .map(
      (topic) => `
    <button class="topic-modal__item ${
      selectedTopicId === topic.id ? "topic-modal__item--active" : ""
    }" 
            data-topic-id="${topic.id}" 
            onclick="selectTopic(${topic.id})">
      <svg class="topic-modal__item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3H14M2 8H14M2 13H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="topic-modal__item-name">${topic.name}</span>
    </button>
  `
    )
    .join("");
}

function selectTopic(topicId) {
  
  if (selectedTopicId === topicId) {
    selectedTopicId = null;
  } else {
    selectedTopicId = topicId;
  }

  
  document.querySelectorAll(".topic-modal__item").forEach((item) => {
    const itemId = parseInt(item.getAttribute("data-topic-id"));
    if (itemId === selectedTopicId) {
      item.classList.add("topic-modal__item--active");
    } else {
      item.classList.remove("topic-modal__item--active");
    }
  });

  updateDeleteTopicButton();
}

function updateDeleteTopicButton() {
  const deleteBtn = document.getElementById("deleteTopicBtn");
  if (deleteBtn) {
    deleteBtn.disabled = selectedTopicId === null;
  }
}

async function createTopic() {
  const input = document.getElementById("newTopicName");
  if (!input) return;

  const topicName = input.value.trim();
  if (!topicName) {
    alert("Vui lòng nhập tên topic");
    return;
  }

  const token = getAuthToken();
  if (!token) {
    alert("Vui lòng đăng nhập để thực hiện thao tác này");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: topicName }),
    });

    if (response.ok || response.status === 201) {
      input.value = "";
      await loadTopicsForModal();
      
      await renderTopicsSidebar();
      alert("Đã tạo topic thành công!");
    } else {
      const error = await response.json().catch(() => ({}));
      alert(error.message || "Không thể tạo topic. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Error creating topic:", error);
    alert("Có lỗi xảy ra khi tạo topic.");
  }
}

async function deleteTopic() {
  if (selectedTopicId === null) {
    alert("Vui lòng chọn một topic để xóa");
    return;
  }

  if (!confirm("Bạn có chắc chắn muốn xóa topic này?")) return;

  const token = getAuthToken();
  if (!token) {
    alert("Vui lòng đăng nhập để thực hiện thao tác này");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/topics/${selectedTopicId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok || response.status === 204) {
      selectedTopicId = null;
      updateDeleteTopicButton();
      await loadTopicsForModal();
      
      await renderTopicsSidebar();
      alert("Đã xóa topic thành công!");
    } else {
      const error = await response.json().catch(() => ({}));
      alert(error.message || "Không thể xóa topic. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Error deleting topic:", error);
    alert("Có lỗi xảy ra khi xóa topic.");
  }
}

function initTopicModalEvents() {
  
  const topicsLink = document.getElementById("topicsLink");
  if (topicsLink) {
    topicsLink.addEventListener("click", (e) => {
      e.preventDefault();
      openTopicModal();
    });
  }

  
  const closeBtn = document.getElementById("closeTopicModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeTopicModal);
  }

  
  const overlay = document.getElementById("topicModalOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeTopicModal);
  }

  
  const createBtn = document.getElementById("createTopicBtn");
  if (createBtn) {
    createBtn.addEventListener("click", createTopic);
  }

  
  const deleteBtn = document.getElementById("deleteTopicBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", deleteTopic);
  }

  
  const input = document.getElementById("newTopicName");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        createTopic();
      }
    });
  }
}

async function init() {
  console.log("Initializing HivePTIT Index...");

  
  currentState.isAuthenticated = checkAuth();
  currentState.currentUser = getCurrentUsername();

  
  if (currentState.isAuthenticated) {
    currentState.isAdmin = await checkAdminRole();
    console.log("Is Admin:", currentState.isAdmin);

    
    updateTopicsMenuVisibility(currentState.isAdmin);
  }

  
  const requestedFeedType = sessionStorage.getItem("feedType");
  if (requestedFeedType === "following") {
    currentState.feedType = "following";
    sessionStorage.removeItem("feedType"); 
  }

  
  initEventListeners();

  
  initTopicModalEvents();

  
  await Promise.all([
    renderTopAuthors(),
    renderTrendingPosts(),
    renderTopicsSidebar(),
  ]);

  
  await loadPosts();

  
  if (currentState.feedType === "following") {
    updateActiveMenu("following");
  }

  
  const shouldOpenTopicsModal = sessionStorage.getItem("openTopicsModal");
  if (shouldOpenTopicsModal && currentState.isAdmin) {
    sessionStorage.removeItem("openTopicsModal");
    openTopicModal();
  }

  console.log("HivePTIT Index initialized successfully");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
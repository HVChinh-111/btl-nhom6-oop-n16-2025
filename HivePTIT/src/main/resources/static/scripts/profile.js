let currentUser = null;
let profileUser = null;
let isOwnProfile = false;
let currentPage = 0;
const pageSize = 10;
let totalPages = 0;
let allTopics = [];

function getUsernameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("username");
}

function formatDate(dateString) {
  if (!dateString) return "";

  
  let date;
  if (typeof dateString === "string") {
    
    if (dateString.startsWith("[")) {
      const parts = JSON.parse(dateString);
      date = new Date(
        parts[0],
        parts[1] - 1,
        parts[2],
        parts[3] || 0,
        parts[4] || 0,
        parts[5] || 0
      );
    } else {
      date = new Date(dateString);
    }
  } else if (Array.isArray(dateString)) {
    
    date = new Date(
      dateString[0],
      dateString[1] - 1,
      dateString[2],
      dateString[3] || 0,
      dateString[4] || 0,
      dateString[5] || 0
    );
  } else {
    date = new Date(dateString);
  }

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

async function fetchUserProfile(username) {
  console.log("profile.js:fetchUserProfile ->", username);
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("profile.js:fetchUserProfile ok", data.username);
      return data;
    } else if (response.status === 404) {
      alert("Không tìm thấy người dùng");
      window.location.href = "index.html";
    } else {
      console.warn("profile.js:fetchUserProfile failed", response.status);
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

async function updateProfile(firstname, lastname, avatarUrl, bio) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        firstname,
        lastname,
        avatarUrl,
        bio,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      throw new Error(error.message || "Cập nhật thất bại");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

async function fetchUserPosts(username, page = 0) {
  try {
    console.log("profile.js:fetchUserPosts ->", username, page);
    const response = await fetch(
      `${API_BASE_URL}/feed/user/${username}?page=${page}&size=${pageSize}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(
        "profile.js:fetchUserPosts ok, type:",
        Array.isArray(data) ? "array" : typeof data,
        data?.length ?? data?.content?.length
      );
      return data;
    }
    console.warn("profile.js:fetchUserPosts non-ok", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }
}

async function createPost(title, content, topicIds) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        title,
        content,
        topicIds,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message || "Tạo bài viết thất bại");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

async function fetchTopics() {
  try {
    const response = await fetch(`${API_BASE_URL}/topics`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

async function toggleFollow(username) {
  try {
    const response = await fetch(`${API_BASE_URL}/follow/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        targetUsername: username,
      }),
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error toggling follow:", error);
    return null;
  }
}

function renderHeaderUserInfo(user) {
  const userMenu = document.querySelector(".header__user");

  if (!user) {
    
    if (userMenu) {
      userMenu.innerHTML = `
        <a href="/sign-in" class="header__login-btn">Đăng nhập</a>
      `;
    }
    return;
  }

  const userName = document.getElementById("userName");
  const userUsername = document.getElementById("userUsername");
  const headerAvatar = document.getElementById("headerAvatar");
  const userMenuAvatar = document.getElementById("userMenuAvatar");

  if (userName) {
    userName.textContent = `${user.lastname} ${user.firstname}`;
  }
  if (userUsername) {
    userUsername.textContent = `@${user.username}`;
  }

  if (user.avatarUrl) {
    if (headerAvatar) {
      headerAvatar.src = user.avatarUrl;
    }
    if (userMenuAvatar) {
      userMenuAvatar.src = user.avatarUrl;
    }
  }
}

function renderProfileHeader(user) {
  document.getElementById(
    "profileName"
  ).textContent = `${user.lastname} ${user.firstname}`;
  document.getElementById("profileUsername").textContent = `@${user.username}`;
  document.getElementById("profileBio").textContent =
    user.bio || "Chưa có giới thiệu";
  document.getElementById("postCount").textContent = user.postCount || 0;
  document.getElementById("followerCount").textContent =
    user.followerCount || 0;
  document.getElementById("followingCount").textContent =
    user.followingCount || 0;
  document.getElementById("rankingCore").textContent = user.rankingCore || 0;

  if (user.avatarUrl) {
    document.getElementById("profileAvatar").src = user.avatarUrl;
  }

  
  const ownProfileActions = document.getElementById("ownProfileActions");
  const followBtn = document.getElementById("followBtn");
  const unfollowBtn = document.getElementById("unfollowBtn");
  const token = getAuthToken();

  if (isOwnProfile) {
    
    ownProfileActions.style.display = "flex";
    followBtn.style.display = "none";
    unfollowBtn.style.display = "none";
  } else {
    
    ownProfileActions.style.display = "none";

    if (!token) {
      
      followBtn.style.display = "flex";
      followBtn.disabled = true;
      followBtn.classList.add("profile__btn--disabled");
      unfollowBtn.style.display = "none";
    } else {
      
      followBtn.disabled = false;
      followBtn.classList.remove("profile__btn--disabled");

      if (user.isFollowing) {
        followBtn.style.display = "none";
        unfollowBtn.style.display = "flex";
      } else {
        followBtn.style.display = "flex";
        unfollowBtn.style.display = "none";
      }
    }
  }
}

function renderUserPosts(posts) {
  const postsContainer = document.getElementById("userPosts");
  const loadingEl = document.getElementById("postsLoading");

  if (loadingEl) {
    loadingEl.style.display = "none";
  }

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="posts__empty">
        <p>Chưa có bài viết nào</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML = posts
    .map((post) => {
      const topicsHTML = post.topics
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

      return `
      <article class="post">
        ${topicsHTML ? `<div class="post__tags">${topicsHTML}</div>` : ""}
        ${
          isOwnProfile
            ? `
        <div class="post__menu">
          <button class="post__menu-btn" onclick="togglePostMenu(${post.postId})">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <div class="post__menu-dropdown" id="postMenu${post.postId}" style="display: none;">
            <button class="post__menu-item" onclick="event.stopPropagation(); openEditPostModal(${post.postId})">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2L14 4.5L5 13.5H2.5V11L11.5 2Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Chỉnh sửa
            </button>
            <button class="post__menu-item post__menu-item--danger" onclick="event.stopPropagation(); deletePost(${post.postId})">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6.5 7.5V11.5M9.5 7.5V11.5M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Xóa
            </button>
          </div>
        </div>
        `
            : ""
        }
        <h3 class="post__title">
          <a href="/post?id=${post.postId}" class="post__title-link">
            ${post.title}
          </a>
        </h3>
        <div class="post__meta">
          <img
            src="${post.authorAvatarUrl || "/images/avatar.jpeg"}"
            alt="${post.authorLastname} ${post.authorFirstname}"
            class="post__author-avatar"
            onerror="this.src='/images/avatar.jpeg'"
          />
          ${
            isOwnProfile
              ? `<span class="post__author">
                ${post.authorLastname} ${post.authorFirstname}
              </span>`
              : `<a href="/profile?username=${post.authorUsername}" class="post__author">
                ${post.authorLastname} ${post.authorFirstname}
              </a>`
          }
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
        <a href="/post?id=${post.postId}" class="post__read-more">
          Đọc thêm
        </a>
      </article>
    `;
    })
    .join("");
}

function renderPagination(pageData) {
  const paginationEl = document.getElementById("postsPagination");
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");
  const pagesContainer = document.getElementById("paginationPages");

  if (!pageData || pageData.totalPages <= 1) {
    paginationEl.style.display = "none";
    return;
  }

  paginationEl.style.display = "flex";
  totalPages = pageData.totalPages;
  currentPage = pageData.currentPage;

  
  if (currentPage === 0) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  
  if (currentPage >= totalPages - 1) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }

  
  let pagesHTML = "";
  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pagesHTML += `
        <button class="pagination__page ${
          i === currentPage ? "pagination__page--active" : ""
        }" data-page="${i}">
          ${i + 1}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pagesHTML += `<span class="pagination__ellipsis">...</span>`;
    }
  }
  pagesContainer.innerHTML = pagesHTML;
}

function renderTopicsCheckboxes(topics) {
  const container = document.getElementById("postTopicsList");
  container.innerHTML = topics
    .map(
      (topic) => `
    <label class="create-post__topic-item">
      <input type="checkbox" name="topicIds" value="${topic.id}" class="create-post__topic-checkbox" />
      <span class="create-post__topic-label">${topic.name}</span>
    </label>
  `
    )
    .join("");
}

function openPostModal() {
  const modal = document.getElementById("postModal");
  const modalTitle = document.getElementById("postModalTitle");
  const postIdInput = document.getElementById("postId");
  const submitBtn = document.getElementById("postSubmitBtn");

  
  document.getElementById("postForm").reset();
  postIdInput.value = "";

  
  modalTitle.textContent = "Tạo bài viết mới";
  submitBtn.textContent = "Đăng bài viết";

  
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

async function openEditPostModal(postId) {
  const modal = document.getElementById("postModal");
  const modalTitle = document.getElementById("postModalTitle");
  const postIdInput = document.getElementById("postId");
  const submitBtn = document.getElementById("postSubmitBtn");
  const titleInput = document.getElementById("postTitle");
  const contentInput = document.getElementById("postContent");
  const errorEl = document.getElementById("postError");
  const errorText = document.getElementById("postErrorText");

  try {
    errorEl.style.display = "none";

    
    const response = await fetch(
      `${API_BASE_URL}/posts/${postId}?includeRawContent=true`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) throw new Error("Không thể tải bài viết");

    const post = await response.json();

    
    postIdInput.value = postId;
    titleInput.value = post.title;
    contentInput.value = post.rawContent || post.content; 

    
    const topicCheckboxes = document.querySelectorAll('input[name="topicIds"]');
    const selectedIds = Array.isArray(post.topics)
      ? post.topics.map((t) => t.id)
      : [];
    topicCheckboxes.forEach((checkbox) => {
      const id = parseInt(checkbox.value);
      checkbox.checked = selectedIds.includes(id);
    });

    
    modalTitle.textContent = "Chỉnh sửa bài viết";
    submitBtn.textContent = "Lưu thay đổi";

    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  } catch (error) {
    errorText.textContent = error.message;
    errorEl.style.display = "flex";
  }
}

function closePostModal() {
  const modal = document.getElementById("postModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  
  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  document.getElementById("postError").style.display = "none";
}

function togglePostMenu(postId) {
  const menu = document.getElementById(`postMenu${postId}`);
  const allMenus = document.querySelectorAll(".post__menu-dropdown");

  
  allMenus.forEach((m) => {
    if (m.id !== `postMenu${postId}`) {
      m.style.display = "none";
    }
  });

  
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".post__menu")) {
    document.querySelectorAll(".post__menu-dropdown").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

async function deletePost(postId) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert("Bạn cần đăng nhập để xóa bài viết");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Delete failed:", response.status, errorData);
      throw new Error(`Không thể xóa bài viết (${response.status})`);
    }

    
    window.location.reload();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Lỗi: " + error.message);
  }
}

document.getElementById("editProfileBtn")?.addEventListener("click", () => {
  const modal = document.getElementById("profileEditModal");
  modal.style.display = "block";

  
  document.getElementById("editFirstname").value = profileUser.firstname;
  document.getElementById("editLastname").value = profileUser.lastname;
  document.getElementById("editAvatarUrl").value = profileUser.avatarUrl || "";
  document.getElementById("editBio").value = profileUser.bio || "";
});

document.getElementById("closeEditModal")?.addEventListener("click", () => {
  document.getElementById("profileEditModal").style.display = "none";
});

document
  .getElementById("editProfileForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("editFirstname").value.trim();
    const lastname = document.getElementById("editLastname").value.trim();
    const avatarUrl = document.getElementById("editAvatarUrl").value.trim();
    const bio = document.getElementById("editBio").value.trim();

    const errorEl = document.getElementById("editProfileError");
    const errorText = document.getElementById("editProfileErrorText");

    try {
      const response = await updateProfile(firstname, lastname, avatarUrl, bio);

      if (response.success) {
        
        profileUser = response.user;
        currentUser = response.user;

        
        renderProfileHeader(profileUser);
        renderHeaderUserInfo(currentUser);

        
        document.getElementById("profileEditModal").style.display = "none";

        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      errorText.textContent = error.message;
      errorEl.style.display = "flex";
    }
  });

document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const postId = document.getElementById("postId").value;
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const topicCheckboxes = document.querySelectorAll(
    'input[name="topicIds"]:checked'
  );
  const topicIds = Array.from(topicCheckboxes).map((cb) => parseInt(cb.value));

  const errorEl = document.getElementById("postError");
  const errorText = document.getElementById("postErrorText");

  if (!title || !content) {
    errorText.textContent = "Vui lòng điền đầy đủ thông tin";
    errorEl.style.display = "flex";
    return;
  }

  try {
    errorEl.style.display = "none";

    if (postId) {
      
      console.log("profile.js: Đang cập nhật bài viết", postId);
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ title, content, topicIds }),
      });

      if (!response.ok) throw new Error("Không thể cập nhật bài viết");

      console.log("profile.js: Cập nhật bài viết thành công!");
    } else {
      
      console.log(
        "profile.js: Đang tạo bài viết với",
        topicIds.length,
        "chủ đề:",
        topicIds
      );
      await createPost(title, content, topicIds);
      console.log("profile.js: Tạo bài viết thành công!");
    }

    
    closePostModal();
    window.location.reload();
  } catch (error) {
    errorText.textContent = error.message;
    errorEl.style.display = "flex";
  }
});

document.getElementById("createPostBtn")?.addEventListener("click", () => {
  openPostModal();
});

document.getElementById("closePostModal")?.addEventListener("click", () => {
  closePostModal();
});

document.getElementById("postModalOverlay")?.addEventListener("click", () => {
  closePostModal();
});

document.getElementById("followBtn")?.addEventListener("click", async () => {
  if (!getAuthToken()) {
    alert("Vui lòng đăng nhập để theo dõi người dùng");
    return;
  }

  const result = await toggleFollow(profileUser.username);
  if (result && result.success) {
    
    profileUser.isFollowing = result.action === "FOLLOWED";

    
    if (result.followerCount !== undefined) {
      profileUser.followerCount = result.followerCount;
    } else {
      
      profileUser.followerCount += result.action === "FOLLOWED" ? 1 : -1;
    }

    renderProfileHeader(profileUser);
  }
});

document.getElementById("unfollowBtn")?.addEventListener("click", async () => {
  if (!getAuthToken()) {
    return;
  }

  const result = await toggleFollow(profileUser.username);
  if (result && result.success) {
    
    profileUser.isFollowing = result.action === "FOLLOWED";

    
    if (result.followerCount !== undefined) {
      profileUser.followerCount = result.followerCount;
    } else {
      
      profileUser.followerCount += result.action === "FOLLOWED" ? 1 : -1;
    }

    renderProfileHeader(profileUser);
  }
});

document.getElementById("prevPageBtn")?.addEventListener("click", () => {
  if (currentPage > 0) {
    loadUserPosts(profileUser.username, currentPage - 1);
  }
});

document.getElementById("nextPageBtn")?.addEventListener("click", () => {
  if (currentPage < totalPages - 1) {
    loadUserPosts(profileUser.username, currentPage + 1);
  }
});

document.getElementById("paginationPages")?.addEventListener("click", (e) => {
  if (e.target.classList.contains("pagination__page")) {
    const page = parseInt(e.target.dataset.page);
    loadUserPosts(profileUser.username, page);
  }
});

async function loadUserPosts(username, page = 0) {
  const postsData = await fetchUserPosts(username, page);
  if (!postsData) {
    console.warn("profile.js:loadUserPosts no data");
    document.getElementById(
      "userPosts"
    ).innerHTML = `<div class="posts__empty"><p>Không có bài viết</p></div>`;
    document.getElementById("postsPagination").style.display = "none";
    return;
  }

  
  if (Array.isArray(postsData)) {
    renderUserPosts(postsData);
  } else if (postsData.content && Array.isArray(postsData.content)) {
    renderUserPosts(postsData.content);
    renderPagination(postsData);
  } else {
    
    try {
      renderUserPosts(Array.from(postsData));
    } catch (err) {
      console.error(
        "profile.js:loadUserPosts cannot render postsData",
        postsData
      );
      document.getElementById(
        "userPosts"
      ).innerHTML = `<div class="posts__empty"><p>Không có bài viết</p></div>`;
    }
  }
  
  if (!postsData.totalPages) {
    const pag = document.getElementById("postsPagination");
    if (pag) pag.style.display = "none";
  }
}

async function initProfile() {
  console.log("profile.js:initProfile called", {
    pathname: window.location.pathname,
    search: window.location.search,
  });
  
  let targetUsername = getUsernameFromURL();

  
  const token = getAuthToken();
  const currentUsername = getCurrentUsername();

  
  if (!targetUsername) {
    if (!token || !currentUsername) {
      
      sessionStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "/sign-in";
      return;
    }
    
    targetUsername = currentUsername;
  }

  
  if (token && currentUsername) {
    currentUser = await fetchCurrentUser();
    if (currentUser) {
      renderHeaderUserInfo(currentUser);
    }
  }

  
  isOwnProfile = currentUsername && targetUsername === currentUsername;

  
  profileUser = await fetchUserProfile(targetUsername);
  if (profileUser) {
    renderProfileHeader(profileUser);
    await loadUserPosts(targetUsername, 0);
  }

  
  if (isOwnProfile) {
    allTopics = await fetchTopics();
    renderTopicsCheckboxes(allTopics);

    
    initBookmarkModal();
  }
}

document.addEventListener("DOMContentLoaded", initProfile);

let bookmarkLists = [];
let selectedBookmarkListId = null;

async function fetchBookmarkLists() {
  try {
    const token = getAuthToken();
    console.log(
      "Fetching bookmark lists with token:",
      token ? "exists" : "missing"
    );

    if (!token) {
      console.error("No auth token found");
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/bookmarks/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Bookmark lists response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Bookmark lists data:", data);
      return data;
    } else {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching bookmark lists:", error);
    return [];
  }
}

async function createBookmarkList(listName) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookmarks/list/create?listName=${encodeURIComponent(
        listName
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo bookmark list");
    }
  } catch (error) {
    console.error("Error creating bookmark list:", error);
    throw error;
  }
}

function renderBookmarkListsSidebar(lists) {
  const container = document.getElementById("bookmarkListsSidebar");
  console.log("Rendering bookmark lists:", lists, "Container:", container);

  if (!container) {
    console.error("Container not found for rendering bookmark lists");
    return;
  }

  if (!lists || lists.length === 0) {
    container.innerHTML = `
      <div class="bookmark-modal__list-empty">
        <p>Chưa có bookmark list nào</p>
        <p style="font-size: 12px; margin-top: 8px;">Tạo một bookmark list mới để lưu các bài viết yêu thích</p>
      </div>
    `;
    return;
  }

  container.innerHTML = lists
    .map(
      (list) => `
      <button 
        class="bookmark-modal__list-item ${
          selectedBookmarkListId === list.listId
            ? "bookmark-modal__list-item--active"
            : ""
        }" 
        data-list-id="${list.listId}"
        data-list-name="${list.name}"
      >
        <svg class="bookmark-modal__list-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21L12 17L5 21V5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="bookmark-modal__list-name">${list.name}</span>
        <span class="bookmark-modal__list-count">${
          list.posts ? list.posts.length : 0
        }</span>
      </button>
    `
    )
    .join("");

  console.log("Rendered bookmark lists HTML");
}

function renderBookmarkPosts(posts) {
  const container = document.getElementById("bookmarkPostsList");

  if (!posts || posts.length === 0) {
    container.innerHTML = `
      <div class="bookmark-modal__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21L12 17L5 21V5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>Bookmark list này chưa có bài viết nào</p>
      </div>
    `;
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
      <div class="bookmark-modal__post-item-wrapper">
        <a href="/post?id=${post.postId}" class="bookmark-modal__post-item">
          <h4 class="bookmark-modal__post-title">${post.title}</h4>
          <div class="bookmark-modal__post-meta">
            <span class="bookmark-modal__post-author">${
              post.author
                ? `${post.author.lastname || ""} ${post.author.firstname || ""}`
                : "Ẩn danh"
            }</span>
            <span>•</span>
            <span>${formatDate(post.createdAt)}</span>
          </div>
        </a>
        <button class="bookmark-modal__post-remove" data-post-id="${
          post.postId
        }" title="Xóa khỏi bookmark list">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    `
    )
    .join("");
}

function openBookmarkModal() {
  const modal = document.getElementById("bookmarkModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  
  loadBookmarkLists();
}

function closeBookmarkModal() {
  const modal = document.getElementById("bookmarkModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  
  selectedBookmarkListId = null;
  document.getElementById("newBookmarkListName").value = "";

  
  const deleteBtn = document.getElementById("deleteBookmarkListBtn");
  if (deleteBtn) deleteBtn.disabled = true;

  
  document.getElementById("bookmarkPostsList").innerHTML = `
    <div class="bookmark-modal__empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21L12 17L5 21V5Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p>Chọn một bookmark list để xem các bài viết</p>
    </div>
  `;
}

async function loadBookmarkLists() {
  const container = document.getElementById("bookmarkListsSidebar");
  console.log("Loading bookmark lists, container:", container);

  if (!container) {
    console.error("bookmarkListsSidebar container not found!");
    return;
  }

  container.innerHTML =
    '<div class="bookmark-modal__loading">Đang tải...</div>';

  bookmarkLists = await fetchBookmarkLists();
  console.log("Loaded bookmark lists:", bookmarkLists);
  renderBookmarkListsSidebar(bookmarkLists);
}

function handleBookmarkListClick(listId) {
  selectedBookmarkListId = listId;

  
  const allItems = document.querySelectorAll(".bookmark-modal__list-item");
  allItems.forEach((item) => {
    item.classList.remove("bookmark-modal__list-item--active");
    if (parseInt(item.dataset.listId) === listId) {
      item.classList.add("bookmark-modal__list-item--active");
    }
  });

  
  const deleteBtn = document.getElementById("deleteBookmarkListBtn");
  if (deleteBtn) deleteBtn.disabled = false;

  
  const selectedList = bookmarkLists.find((list) => list.listId === listId);
  if (selectedList) {
    renderBookmarkPosts(selectedList.posts || []);
  }
}

async function handleCreateBookmarkList() {
  const input = document.getElementById("newBookmarkListName");
  const listName = input.value.trim();

  if (!listName) {
    alert("Vui lòng nhập tên bookmark list");
    return;
  }

  try {
    const result = await createBookmarkList(listName);
    if (result.success) {
      
      input.value = "";

      
      await loadBookmarkLists();

      
      console.log("Bookmark list created:", result);
    } else {
      alert(result.message || "Không thể tạo bookmark list");
    }
  } catch (error) {
    alert(error.message);
  }
}

async function deleteBookmarkList(listId) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/list/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa bookmark list");
    }
  } catch (error) {
    console.error("Error deleting bookmark list:", error);
    throw error;
  }
}

async function removePostFromBookmarkList(listName, postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        listName: listName,
        postId: parseInt(postId),
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(
        error.message || "Không thể xóa bài viết khỏi bookmark list"
      );
    }
  } catch (error) {
    console.error("Error removing post from bookmark list:", error);
    throw error;
  }
}

async function handleDeleteBookmarkList() {
  if (!selectedBookmarkListId) {
    alert("Vui lòng chọn một bookmark list để xóa");
    return;
  }

  const selectedList = bookmarkLists.find(
    (list) => list.listId === selectedBookmarkListId
  );
  if (!selectedList) return;

  if (
    !confirm(`Bạn có chắc chắn muốn xóa bookmark list "${selectedList.name}"?`)
  ) {
    return;
  }

  try {
    const result = await deleteBookmarkList(selectedBookmarkListId);
    if (result.success) {
      
      selectedBookmarkListId = null;

      
      const deleteBtn = document.getElementById("deleteBookmarkListBtn");
      if (deleteBtn) deleteBtn.disabled = true;

      
      document.getElementById("bookmarkPostsList").innerHTML = `
        <div class="bookmark-modal__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21L12 17L5 21V5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p>Chọn một bookmark list để xem các bài viết</p>
        </div>
      `;

      
      await loadBookmarkLists();
    } else {
      alert(result.message || "Không thể xóa bookmark list");
    }
  } catch (error) {
    alert(error.message);
  }
}

async function handleRemovePostFromBookmarkList(postId) {
  if (!selectedBookmarkListId) return;

  const selectedList = bookmarkLists.find(
    (list) => list.listId === selectedBookmarkListId
  );
  if (!selectedList) return;

  try {
    const result = await removePostFromBookmarkList(selectedList.name, postId);
    if (result.success) {
      
      await loadBookmarkLists();

      
      const updatedList = bookmarkLists.find(
        (list) => list.listId === selectedBookmarkListId
      );
      if (updatedList) {
        renderBookmarkPosts(updatedList.posts || []);
      }
    } else {
      alert(result.message || "Không thể xóa bài viết khỏi bookmark list");
    }
  } catch (error) {
    alert(error.message);
  }
}

function initBookmarkModal() {
  
  const openBtn = document.getElementById("bookmarkListsBtn");
  if (openBtn) {
    openBtn.addEventListener("click", openBookmarkModal);
  }

  
  const closeBtn = document.getElementById("closeBookmarkModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeBookmarkModal);
  }

  
  const overlay = document.getElementById("bookmarkModalOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeBookmarkModal);
  }

  
  const createBtn = document.getElementById("createBookmarkListBtn");
  if (createBtn) {
    createBtn.addEventListener("click", handleCreateBookmarkList);
  }

  
  const deleteBtn = document.getElementById("deleteBookmarkListBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteBookmarkList);
  }

  
  const createInput = document.getElementById("newBookmarkListName");
  if (createInput) {
    createInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleCreateBookmarkList();
      }
    });
  }

  
  const listsSidebar = document.getElementById("bookmarkListsSidebar");
  if (listsSidebar) {
    listsSidebar.addEventListener("click", (e) => {
      const listItem = e.target.closest(".bookmark-modal__list-item");
      if (listItem) {
        const listId = parseInt(listItem.dataset.listId);
        handleBookmarkListClick(listId);
      }
    });
  }

  
  const postsContainer = document.getElementById("bookmarkPostsList");
  if (postsContainer) {
    postsContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".bookmark-modal__post-remove");
      if (removeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const postId = parseInt(removeBtn.dataset.postId);
        handleRemovePostFromBookmarkList(postId);
      }
    });
  }
}
// ========== CONSTANTS ==========
// `API_BASE_URL` is provided by `common.js`; do not redeclare here.

// ========== STATE MANAGEMENT ==========
let currentUser = null;
let profileUser = null;
let isOwnProfile = false;
let currentPage = 0;
const pageSize = 10;
let totalPages = 0;
let allTopics = [];

// ========== UTILITY FUNCTIONS ==========
// Note: getAuthToken, getCurrentUsername, logout are now in common.js
// Keeping local copies for backward compatibility

// Lấy username từ URL query params
function getUsernameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("username");
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "";

  // Handle both Instant (ISO string) and LocalDateTime formats
  let date;
  if (typeof dateString === "string") {
    // If it's array format from LocalDateTime [year, month, day, hour, minute, second]
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
    // LocalDateTime as array
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

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("vi-VN", options);
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

// Lấy thông tin profile user
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

// Cập nhật profile
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

// Lấy bài viết của user
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

// Tạo bài viết mới
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

// Lấy danh sách topics
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

// Follow/Unfollow user
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

// ========== RENDER FUNCTIONS ==========

// Render header user info
function renderHeaderUserInfo(user) {
  const userMenu = document.querySelector(".header__user");

  if (!user) {
    // Show login button instead of user menu
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

// Render profile header
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

  // Hiển thị nút phù hợp
  const editBtn = document.getElementById("editProfileBtn");
  const createPostBtn = document.getElementById("createPostBtn");
  const followBtn = document.getElementById("followBtn");
  const unfollowBtn = document.getElementById("unfollowBtn");
  const token = getAuthToken();

  if (isOwnProfile) {
    // Xem profile bản thân
    editBtn.style.display = "flex";
    createPostBtn.style.display = "flex";
    followBtn.style.display = "none";
    unfollowBtn.style.display = "none";
  } else {
    // Xem profile người khác
    editBtn.style.display = "none";
    createPostBtn.style.display = "none";

    if (!token) {
      // Chưa đăng nhập -> vô hiệu hóa nút follow
      followBtn.style.display = "flex";
      followBtn.disabled = true;
      followBtn.classList.add("profile__btn--disabled");
      unfollowBtn.style.display = "none";
    } else {
      // Đã đăng nhập -> hiển thị nút follow/unfollow
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

// Render user posts
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

// Render pagination
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

  // Update prev button
  if (currentPage === 0) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  // Update next button
  if (currentPage >= totalPages - 1) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }

  // Render page numbers
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

// Render topics for create post form
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

// ========== EVENT HANDLERS ==========

// ========== MODAL HANDLERS ==========
// Open post modal for creating new post
function openPostModal() {
  const modal = document.getElementById("postModal");
  const modalTitle = document.getElementById("postModalTitle");
  const postIdInput = document.getElementById("postId");
  const submitBtn = document.getElementById("postSubmitBtn");

  // Reset form
  document.getElementById("postForm").reset();
  postIdInput.value = "";

  // Set to create mode
  modalTitle.textContent = "Tạo bài viết mới";
  submitBtn.textContent = "Đăng bài viết";

  // Show modal
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Open post modal for editing existing post
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

    // Fetch post with rawContent
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

    // Pre-fill form with existing data
    postIdInput.value = postId;
    titleInput.value = post.title;
    contentInput.value = post.rawContent || post.content; // Use rawContent (markdown)

    // Pre-select topics (post.topics is array of { id, name })
    const topicCheckboxes = document.querySelectorAll('input[name="topicIds"]');
    const selectedIds = Array.isArray(post.topics)
      ? post.topics.map((t) => t.id)
      : [];
    topicCheckboxes.forEach((checkbox) => {
      const id = parseInt(checkbox.value);
      checkbox.checked = selectedIds.includes(id);
    });

    // Set to edit mode
    modalTitle.textContent = "Chỉnh sửa bài viết";
    submitBtn.textContent = "Lưu thay đổi";

    // Show modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  } catch (error) {
    errorText.textContent = error.message;
    errorEl.style.display = "flex";
  }
}

// Close post modal
function closePostModal() {
  const modal = document.getElementById("postModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  // Reset form
  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  document.getElementById("postError").style.display = "none";
}

// Toggle post menu dropdown
function togglePostMenu(postId) {
  const menu = document.getElementById(`postMenu${postId}`);
  const allMenus = document.querySelectorAll(".post__menu-dropdown");

  // Close all other menus
  allMenus.forEach((m) => {
    if (m.id !== `postMenu${postId}`) {
      m.style.display = "none";
    }
  });

  // Toggle current menu
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".post__menu")) {
    document.querySelectorAll(".post__menu-dropdown").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

// Delete post with confirmation
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

    // Reload page after successful delete
    window.location.reload();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Lỗi: " + error.message);
  }
}

// Handle edit profile button
document.getElementById("editProfileBtn")?.addEventListener("click", () => {
  const modal = document.getElementById("profileEditModal");
  modal.style.display = "block";

  // Pre-fill form
  document.getElementById("editFirstname").value = profileUser.firstname;
  document.getElementById("editLastname").value = profileUser.lastname;
  document.getElementById("editAvatarUrl").value = profileUser.avatarUrl || "";
  document.getElementById("editBio").value = profileUser.bio || "";
});

// Handle close edit modal
document.getElementById("closeEditModal")?.addEventListener("click", () => {
  document.getElementById("profileEditModal").style.display = "none";
});

// Handle edit profile form submit
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
        // Update profile user
        profileUser = response.user;
        currentUser = response.user;

        // Re-render
        renderProfileHeader(profileUser);
        renderHeaderUserInfo(currentUser);

        // Close modal
        document.getElementById("profileEditModal").style.display = "none";

        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      errorText.textContent = error.message;
      errorEl.style.display = "flex";
    }
  });

// Handle create post form submit
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
      // Edit existing post
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
      // Create new post
      console.log(
        "profile.js: Đang tạo bài viết với",
        topicIds.length,
        "chủ đề:",
        topicIds
      );
      await createPost(title, content, topicIds);
      console.log("profile.js: Tạo bài viết thành công!");
    }

    // Close modal and reload page
    closePostModal();
    window.location.reload();
  } catch (error) {
    errorText.textContent = error.message;
    errorEl.style.display = "flex";
  }
});

// Handle create post button
document.getElementById("createPostBtn")?.addEventListener("click", () => {
  openPostModal();
});

// Handle close post modal
document.getElementById("closePostModal")?.addEventListener("click", () => {
  closePostModal();
});

// Handle post modal overlay click
document.getElementById("postModalOverlay")?.addEventListener("click", () => {
  closePostModal();
});

// Handle follow button
document.getElementById("followBtn")?.addEventListener("click", async () => {
  if (!getAuthToken()) {
    alert("Vui lòng đăng nhập để theo dõi người dùng");
    return;
  }

  const result = await toggleFollow(profileUser.username);
  if (result && result.success) {
    // Cập nhật trạng thái follow
    profileUser.isFollowing = result.action === "FOLLOWED";

    // Cập nhật số lượng followers từ response
    if (result.followerCount !== undefined) {
      profileUser.followerCount = result.followerCount;
    } else {
      // Nếu API không trả về followerCount, tự tăng/giảm
      profileUser.followerCount += result.action === "FOLLOWED" ? 1 : -1;
    }

    renderProfileHeader(profileUser);
  }
});

// Handle unfollow button
document.getElementById("unfollowBtn")?.addEventListener("click", async () => {
  if (!getAuthToken()) {
    return;
  }

  const result = await toggleFollow(profileUser.username);
  if (result && result.success) {
    // Cập nhật trạng thái follow
    profileUser.isFollowing = result.action === "FOLLOWED";

    // Cập nhật số lượng followers từ response
    if (result.followerCount !== undefined) {
      profileUser.followerCount = result.followerCount;
    } else {
      // Nếu API không trả về followerCount, tự tăng/giảm
      profileUser.followerCount += result.action === "FOLLOWED" ? 1 : -1;
    }

    renderProfileHeader(profileUser);
  }
});

// Handle pagination
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

// ========== MAIN FUNCTIONS ==========

// Load user posts
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

  // API may return either an array (List<FeedPostResponse>) or a paged object with `content`
  if (Array.isArray(postsData)) {
    renderUserPosts(postsData);
  } else if (postsData.content && Array.isArray(postsData.content)) {
    renderUserPosts(postsData.content);
    renderPagination(postsData);
  } else {
    // Fallback: try to render as array-like
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
  // Hide pagination if not provided
  if (!postsData.totalPages) {
    const pag = document.getElementById("postsPagination");
    if (pag) pag.style.display = "none";
  }
}

// Initialize profile page
async function initProfile() {
  console.log("profile.js:initProfile called", {
    pathname: window.location.pathname,
    search: window.location.search,
  });
  // Get username from URL
  let targetUsername = getUsernameFromURL();

  // Check if user is logged in
  const token = getAuthToken();
  const currentUsername = getCurrentUsername();

  // Nếu truy cập /profile (không có username param)
  if (!targetUsername) {
    if (!token || !currentUsername) {
      // Chưa đăng nhập -> redirect về sign-in
      sessionStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "/sign-in";
      return;
    }
    // Đã đăng nhập -> xem profile bản thân
    targetUsername = currentUsername;
  }

  // Fetch current user info (nếu đã đăng nhập)
  if (token && currentUsername) {
    currentUser = await fetchCurrentUser();
    if (currentUser) {
      renderHeaderUserInfo(currentUser);
    }
  }

  // Check if viewing own profile
  isOwnProfile = currentUsername && targetUsername === currentUsername;

  // Fetch profile user
  profileUser = await fetchUserProfile(targetUsername);
  if (profileUser) {
    renderProfileHeader(profileUser);
    await loadUserPosts(targetUsername, 0);
  }

  // Load topics for create post form (chỉ khi xem profile bản thân)
  if (isOwnProfile) {
    allTopics = await fetchTopics();
    renderTopicsCheckboxes(allTopics);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initProfile);

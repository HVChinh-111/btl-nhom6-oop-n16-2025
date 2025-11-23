// ========== POST DETAIL PAGE - Trang chi tiết bài viết ==========

// Store current user's vote state
let currentUserVote = null; // "UPVOTE", "DOWNVOTE", or null
let currentVoteCount = 0;

// Lấy post ID từ URL parameter
function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Format date cho post
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

// Fetch post data từ API
async function fetchPost(postId) {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    // Add auth token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      // Try to read error body for more info
      let bodyText = null;
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = null;
      }
      const err = new Error(
        `Không thể tải bài viết (status=${response.status})`
      );
      err.status = response.status;
      err.body = bodyText;
      throw err;
    }

    return await response.json();
  } catch (error) {
    // Log more details for debugging
    console.error("Error fetching post:", error);
    if (error.body) console.error("Response body:", error.body);
    throw error;
  }
}

// Render post data lên trang
function renderPost(post) {
  // Update title
  document.getElementById("postTitle").textContent = post.title;
  document.title = `${post.title} - HivePTIT`;

  // Update author info
  if (post.author) {
    const authorAvatar = document.getElementById("authorAvatar");
    const authorName = document.getElementById("authorName");

    authorAvatar.src = post.author.avatarUrl || "/images/avatar.jpeg";
    authorAvatar.alt = post.author.username;
    authorAvatar.onerror = function () {
      this.src = "/images/avatar.jpeg";
    };

    const displayName =
      post.author.lastname && post.author.firstname
        ? `${post.author.lastname} ${post.author.firstname}`
        : post.author.username;

    authorName.textContent = displayName;
    authorName.href = `/profile?user=${post.author.username}`;
  }

  // Update date
  document.getElementById("postDate").textContent = formatDate(post.createdAt);

  // Update topics
  const topicsContainer = document.getElementById("postTopics");
  topicsContainer.innerHTML = "";

  if (post.topics && post.topics.length > 0) {
    post.topics.forEach((topic) => {
      const topicTag = document.createElement("span");
      topicTag.className = "topic-tag";
      topicTag.textContent = topic.name;
      topicsContainer.appendChild(topicTag);
    });
  }

  // Update content (HTML từ markdown)
  const bodyContainer = document.getElementById("postBody");
  bodyContainer.innerHTML = post.content;

  // Apply Prism.js syntax highlighting cho code blocks
  Prism.highlightAllUnder(bodyContainer);

  // Update vote count
  currentVoteCount = post.voteCount || 0;
  currentUserVote = post.userVoteType || null;
  updateVoteUI();

  // Generate table of contents
  generateTableOfContents();

  // Init scroll spy cho TOC
  initScrollSpy();

  // Show post container, hide loading
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("postContainer").style.display = "grid";
}

// Generate Table of Contents từ các heading trong content
function generateTableOfContents() {
  const bodyContainer = document.getElementById("postBody");
  const tocNav = document.getElementById("tocNav");

  // Lấy tất cả heading (h1-h6)
  const headings = bodyContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

  if (headings.length === 0) {
    tocNav.innerHTML = '<p class="post-detail__toc-empty">Không có mục lục</p>';
    return;
  }

  // Tạo danh sách TOC
  const tocList = document.createElement("ul");
  tocList.className = "post-detail__toc-list";

  headings.forEach((heading, index) => {
    // Tạo ID cho heading nếu chưa có
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    const tocItem = document.createElement("li");
    tocItem.className = "post-detail__toc-item";

    const tocLink = document.createElement("a");
    tocLink.href = `#${heading.id}`;
    tocLink.className = "post-detail__toc-link";
    tocLink.textContent = heading.textContent;

    // Thêm indentation dựa vào level của heading
    const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2...
    tocLink.style.paddingLeft = `${(level - 1) * 12 + 12}px`;

    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);

    // Smooth scroll khi click vào TOC link
    tocLink.addEventListener("click", (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update active state
      document.querySelectorAll(".post-detail__toc-link").forEach((link) => {
        link.classList.remove("post-detail__toc-link--active");
      });
      tocLink.classList.add("post-detail__toc-link--active");
    });
  });

  tocNav.innerHTML = "";
  tocNav.appendChild(tocList);
}

// Init scroll spy - highlight TOC item khi scroll đến heading tương ứng
function initScrollSpy() {
  const headings = document.querySelectorAll(
    "#postBody h1, #postBody h2, #postBody h3, #postBody h4, #postBody h5, #postBody h6"
  );
  const tocLinks = document.querySelectorAll(".post-detail__toc-link");

  if (headings.length === 0 || tocLinks.length === 0) return;

  // Intersection Observer để detect heading nào đang visible
  const observerOptions = {
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  let activeHeading = null;

  // Tìm container TOC để scroll khi cần (nearest scrollable ancestor)
  const tocContainer = document.querySelector(".post-detail__toc-sticky");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeHeading = entry.target;

        // Update active TOC link
        tocLinks.forEach((link) => {
          link.classList.remove("post-detail__toc-link--active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("post-detail__toc-link--active");

            // Auto-scroll TOC container so the active link is visible.
            // Use scrollIntoView on the link; it will scroll the nearest
            // scrollable ancestor (the tocContainer) rather than the page.
            try {
              // Only scroll if the link is not currently fully visible inside the container
              if (tocContainer) {
                const linkRect = link.getBoundingClientRect();
                const containerRect = tocContainer.getBoundingClientRect();
                if (
                  linkRect.top < containerRect.top ||
                  linkRect.bottom > containerRect.bottom
                ) {
                  link.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest",
                  });
                }
              } else {
                // Fallback: scroll the link into view in the document
                link.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }
            } catch (e) {
              // ignore scroll errors
              console.warn("TOC scrollIntoView failed", e);
            }
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach((heading) => {
    observer.observe(heading);
  });
}

// Show error message
function showError(message) {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("errorState").style.display = "block";
  document.getElementById("errorMessage").textContent = message;
}

// Update vote UI based on current state
function updateVoteUI() {
  const upvoteBtn = document.getElementById("upvoteBtn");
  const downvoteBtn = document.getElementById("downvoteBtn");
  const voteCountEl = document.getElementById("voteCount");

  // Update count
  voteCountEl.textContent = currentVoteCount;

  // Update button states
  upvoteBtn.classList.remove("post-detail__vote-btn--active");
  downvoteBtn.classList.remove("post-detail__vote-btn--active");

  if (currentUserVote === "UPVOTE") {
    upvoteBtn.classList.add("post-detail__vote-btn--active");
  } else if (currentUserVote === "DOWNVOTE") {
    downvoteBtn.classList.add("post-detail__vote-btn--active");
  }
}

// Handle vote click with YouTube-like logic
async function handleVote(postId, voteType) {
  const token = getAuthToken();
  if (!token) {
    alert("Vui lòng đăng nhập để vote");
    return;
  }

  // Send request to server
  try {
    const response = await fetch(`${API_BASE_URL}/votes/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId: postId,
        voteType: voteType,
      }),
    });

    if (!response.ok) {
      throw new Error("Không thể vote");
    }

    const result = await response.json();

    // Update vote count from server response
    currentVoteCount = result.totalScore;

    // Update user vote state based on action
    if (result.action === "REMOVED") {
      // Vote was removed (clicked same vote again)
      currentUserVote = null;
    } else if (result.action === "ADDED") {
      // New vote was added
      currentUserVote = voteType;
    } else if (result.action === "CHANGED") {
      // Vote was changed from one type to another
      currentUserVote = voteType;
    }

    updateVoteUI();
  } catch (error) {
    console.error("Error voting:", error);
    alert("Không thể vote. Vui lòng thử lại.");
  }
}

// Handle AI summarization
async function handleSummarize(postId) {
  const summarizeBtn = document.getElementById("summarizeBtn");
  const summaryContainer = document.getElementById("summaryContainer");
  const summaryText = document.getElementById("summaryText");
  
  try {
    summarizeBtn.disabled = true;
    summarizeBtn.textContent = "Đang tóm tắt...";
    summaryText.textContent = "Đang xử lý...";
    summaryContainer.style.display = "block";
    
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/summarize`, {
      method: "POST",
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error("Không thể tóm tắt bài viết");
    }
    
    const result = await response.json();
    summaryText.textContent = result.summary;
  } catch (error) {
    console.error("Error summarizing:", error);
    summaryText.textContent = "Lỗi: " + error.message;
  } finally {
    summarizeBtn.disabled = false;
    summarizeBtn.textContent = "Tóm tắt bằng AI";
  }
}

// Init post detail page
async function initPostDetail() {
  const postId = getPostIdFromURL();

  if (!postId) {
    showError("Không tìm thấy ID bài viết");
    return;
  }

  try {
    // Fetch post data
    const post = await fetchPost(postId);

    // Render post
    renderPost(post);

    // Setup vote buttons
    const upvoteBtn = document.getElementById("upvoteBtn");
    const downvoteBtn = document.getElementById("downvoteBtn");

    upvoteBtn.addEventListener("click", () => handleVote(postId, "UPVOTE"));
    downvoteBtn.addEventListener("click", () => handleVote(postId, "DOWNVOTE"));
    
    // Setup summarize button
    const summarizeBtn = document.getElementById("summarizeBtn");
    if (summarizeBtn) {
      summarizeBtn.addEventListener("click", () => handleSummarize(postId));
    }
  } catch (error) {
    console.error("Error initializing post detail:", error);
    showError("Không thể tải bài viết. Vui lòng thử lại sau.");
  }
}

// Init khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPostDetail);
} else {
  initPostDetail();
}

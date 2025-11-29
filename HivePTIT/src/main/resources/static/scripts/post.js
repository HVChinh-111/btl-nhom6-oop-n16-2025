// ========== POST DETAIL PAGE - Trang chi tiết bài viết ==========

// Store current user's vote state
let currentUserVote = null; // "UPVOTE", "DOWNVOTE", or null
let currentVoteCount = 0;

// Store admin status for current user
let isCurrentUserAdmin = false;

// Lấy post ID từ URL parameter
function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Format date cho post
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  // Nếu bé hơn 1 phút: hiển thị "Vừa xong"
  if (diffInMinutes < 1) {
    return "Vừa xong";
  }
  // Nếu bé hơn 60 phút: hiển thị ... phút trước
  else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  // Nếu bé hơn 24 giờ: hiển thị ... giờ trước
  else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  // Nếu lớn hơn 1 ngày: hiển thị ngày đăng bài (DD/MM/YYYY)
  else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
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
    authorName.href = `/profile?username=${post.author.username}`;
  }

  // Update date
  document.getElementById("postDate").textContent = formatDate(post.createdAt);

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

// ========== COMMENTS HANDLING ==========

// Fetch comments (parents with replies) for a post
async function fetchComments(postId) {
  try {
    const resp = await fetch(
      `${API_BASE_URL}/posts/${postId}/comments?depth=1&size=200&sortBy=createdAt&direction=asc`
    );
    if (!resp.ok) throw new Error("Không thể tải bình luận");
    const data = await resp.json();
    return data.content || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Create a DOM element for a comment (including replies)
// isReply: true if this is a child of another comment (not a top-level comment)
function createCommentElement(comment, postId, isReply = false) {
  const item = document.createElement("div");
  item.className = "comments__item";
  item.dataset.commentId = comment.id;

  const avatar = document.createElement("img");
  avatar.className = "comments__item-avatar";
  avatar.src = comment.author?.avatarUrl || "/images/avatar.jpeg";
  avatar.onerror = function () {
    this.src = "/images/avatar.jpeg";
  };

  const body = document.createElement("div");
  body.className = "comments__item-body";

  const meta = document.createElement("div");
  meta.className = "comments__item-meta";
  const author = document.createElement("span");
  author.className = "comments__author";
  author.textContent =
    comment.author && comment.author.firstname
      ? `${comment.author.lastname || ""} ${
          comment.author.firstname || ""
        }`.trim()
      : comment.author?.username || "Người dùng";

  const time = document.createElement("span");
  time.className = "comments__time";
  time.textContent = formatDate(comment.createdAt);

  meta.appendChild(author);
  meta.appendChild(time);

  const content = document.createElement("div");
  content.className = "comments__content";
  content.dataset.originalContent = comment.content; // Store original content for editing
  content.innerHTML = comment.content;

  const actions = document.createElement("div");
  actions.className = "comments__actions";

  // Only show reply button for top-level comments (not replies of replies)
  if (!isReply) {
    const replyBtn = document.createElement("button");
    replyBtn.className = "comments__reply-btn";
    replyBtn.textContent = "Trả lời";
    actions.appendChild(replyBtn);

    // Disable reply if not authenticated
    if (!checkAuth()) {
      replyBtn.disabled = true;
      item.classList.add("comments__item--disabled");
    }

    // Reply button opens an inline composer
    replyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // If already has a composer, don't open another
      if (item.querySelector(".comments__inline-composer")) return;

      const inline = document.createElement("div");
      inline.className = "comments__composer comments__inline-composer";
      const inlineAvatar = document.createElement("img");
      inlineAvatar.className = "comments__composer-avatar";
      inlineAvatar.src = "/images/avatar.jpeg";

      const inlineBody = document.createElement("div");
      inlineBody.className = "comments__composer-body";
      const textarea = document.createElement("textarea");
      textarea.className = "comments__composer-input";
      textarea.rows = 2;
      textarea.placeholder = "Viết trả lời...";

      const actionsWrap = document.createElement("div");
      actionsWrap.className = "comments__composer-actions";
      const submit = document.createElement("button");
      submit.className = "comments__reply-btn";
      submit.textContent = "Trả lời";
      const cancel = document.createElement("button");
      cancel.className = "comments__reply-btn";
      cancel.textContent = "Hủy";

      actionsWrap.appendChild(cancel);
      actionsWrap.appendChild(submit);

      inlineBody.appendChild(textarea);
      inlineBody.appendChild(actionsWrap);

      inline.appendChild(inlineAvatar);
      inline.appendChild(inlineBody);

      // Insert inline composer under this comment
      repliesContainer.insertBefore(inline, repliesContainer.firstChild);

      // Prefill avatar if user profile available
      fetchCurrentUserProfile().then((profile) => {
        if (profile && profile.avatarUrl) inlineAvatar.src = profile.avatarUrl;
      });

      // Cancel handler
      cancel.addEventListener("click", (ev) => {
        ev.preventDefault();
        inline.remove();
      });

      // Submit reply
      submit.addEventListener("click", async (ev) => {
        ev.preventDefault();
        if (!checkAuth()) {
          alert("Vui lòng đăng nhập để trả lời");
          return;
        }
        const text = textarea.value.trim();
        if (!text) return;
        submit.disabled = true;
        try {
          const created = await createComment(postId, text, comment.id);
          if (created) {
            // Append created reply and remove inline composer
            repliesContainer.insertBefore(
              createCommentElement(created, postId, true),
              inline
            );
            inline.remove();
          }
        } catch (err) {
          console.error("Reply error:", err);
          alert("Không thể gửi trả lời");
        } finally {
          submit.disabled = false;
        }
      });
    });
  }

  body.appendChild(meta);
  body.appendChild(content);
  body.appendChild(actions);

  item.appendChild(avatar);
  item.appendChild(body);

  // Check if current user is the owner of this comment
  const currentUsername = getCurrentUsername();
  const isOwner =
    comment.author?.username &&
    currentUsername &&
    comment.author.username === currentUsername;

  // Check if user can manage this comment (owner or admin)
  const canEdit = isOwner; // Only owner can edit
  const canDelete = isOwner || isCurrentUserAdmin; // Owner or admin can delete

  // Add menu for comment owner or admin (edit/delete)
  if (canEdit || canDelete) {
    const menu = document.createElement("div");
    menu.className = "comment__menu";

    const menuBtn = document.createElement("button");
    menuBtn.className = "comment__menu-btn";
    menuBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    `;
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCommentMenu(comment.id);
    });

    const dropdown = document.createElement("div");
    dropdown.className = "comment__menu-dropdown";
    dropdown.id = `commentMenu${comment.id}`;
    dropdown.style.display = "none";

    // Edit button - only for owner
    if (canEdit) {
      const editBtn = document.createElement("button");
      editBtn.className = "comment__menu-item";
      editBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2L14 4.5L5 13.5H2.5V11L11.5 2Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Chỉnh sửa
      `;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCommentMenu(comment.id); // Close menu
        openEditCommentForm(item, comment);
      });
      dropdown.appendChild(editBtn);
    }

    // Delete button - for owner or admin
    if (canDelete) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "comment__menu-item comment__menu-item--danger";
      deleteBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6.5 7.5V11.5M9.5 7.5V11.5M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Xóa
      `;
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        toggleCommentMenu(comment.id); // Close menu
        await deleteComment(comment.id, item);
      });
      dropdown.appendChild(deleteBtn);
    }

    menu.appendChild(menuBtn);
    menu.appendChild(dropdown);
    item.appendChild(menu);
  }

  // Replies container
  const repliesContainer = document.createElement("div");
  repliesContainer.className = "comments__replies";
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((r) => {
      // Replies of replies are marked as isReply = true (no reply button)
      repliesContainer.appendChild(createCommentElement(r, postId, true));
    });
  }
  body.appendChild(repliesContainer);

  return item;
}

// Toggle comment menu dropdown
function toggleCommentMenu(commentId) {
  const menu = document.getElementById(`commentMenu${commentId}`);
  const allMenus = document.querySelectorAll(".comment__menu-dropdown");

  // Close all other menus
  allMenus.forEach((m) => {
    if (m.id !== `commentMenu${commentId}`) {
      m.style.display = "none";
    }
  });

  // Toggle current menu
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

// Close comment menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".comment__menu")) {
    document.querySelectorAll(".comment__menu-dropdown").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

// Open edit comment form inline
function openEditCommentForm(commentItem, comment) {
  const contentEl = commentItem.querySelector(".comments__content");
  const actionsEl = commentItem.querySelector(".comments__actions");

  // If already editing, don't open another
  if (commentItem.querySelector(".comment__edit-form")) return;

  // Hide original content and actions
  contentEl.style.display = "none";
  actionsEl.style.display = "none";

  // Create edit form
  const editForm = document.createElement("div");
  editForm.className = "comment__edit-form";

  const textarea = document.createElement("textarea");
  textarea.className = "comment__edit-textarea";
  textarea.value = contentEl.dataset.originalContent || contentEl.textContent;
  textarea.rows = 3;

  const editActions = document.createElement("div");
  editActions.className = "comment__edit-actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "comments__reply-btn";
  cancelBtn.textContent = "Hủy";
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editForm.remove();
    contentEl.style.display = "";
    actionsEl.style.display = "";
  });

  const saveBtn = document.createElement("button");
  saveBtn.className = "comments__reply-btn";
  saveBtn.textContent = "Lưu";
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const newContent = textarea.value.trim();
    if (!newContent) {
      alert("Nội dung không được để trống");
      return;
    }

    saveBtn.disabled = true;
    try {
      const updated = await updateComment(comment.id, newContent);
      if (updated) {
        // Update content display
        contentEl.innerHTML = updated.content;
        contentEl.dataset.originalContent = updated.content;
        editForm.remove();
        contentEl.style.display = "";
        actionsEl.style.display = "";
      }
    } catch (err) {
      console.error("Update comment error:", err);
      alert("Không thể cập nhật bình luận");
    } finally {
      saveBtn.disabled = false;
    }
  });

  editActions.appendChild(cancelBtn);
  editActions.appendChild(saveBtn);
  editForm.appendChild(textarea);
  editForm.appendChild(editActions);

  // Insert after content
  contentEl.parentNode.insertBefore(editForm, contentEl.nextSibling);
  textarea.focus();
}

// Update comment via API
async function updateComment(commentId, content) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");

    const resp = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(body || "Failed to update comment");
    }

    return await resp.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

// Delete comment via API
async function deleteComment(commentId, commentItem) {
  if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert("Bạn cần đăng nhập để xóa bình luận");
      return;
    }

    const resp = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Không thể xóa bình luận");
    }

    // Remove comment from DOM
    commentItem.remove();
  } catch (error) {
    console.error("Error deleting comment:", error);
    alert("Lỗi: " + error.message);
  }
}

// Render comments list
function renderCommentsList(comments, postId) {
  const list = document.getElementById("commentsList");
  if (!list) return;
  list.innerHTML = "";
  comments.forEach((c) => {
    list.appendChild(createCommentElement(c, postId, false));
  });
}

// Create comment via API
async function createComment(postId, content, parentCommentId = null) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");

    const resp = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
        parentCommentId: parentCommentId,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(body || "Failed to create comment");
    }

    const created = await resp.json();
    return created;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

// Initialize comments area: load existing and wire composer
async function initComments(postId) {
  const composer = document.getElementById("commentsComposer");
  const input = document.getElementById("newCommentInput");
  const submitBtn = document.getElementById("submitCommentBtn");

  // Set composer avatar if available
  fetchCurrentUserProfile().then((profile) => {
    const avatar = document.getElementById("composerAvatar");
    if (profile && avatar)
      avatar.src = profile.avatarUrl || "/images/avatar.jpeg";
  });

  // Disable composer if not authenticated
  if (!checkAuth()) {
    if (composer) composer.classList.add("comments__composer--disabled");
    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
  }

  // Load comments
  const comments = await fetchComments(postId);
  renderCommentsList(comments, postId);

  // Submit new top-level comment
  if (submitBtn) {
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!checkAuth()) {
        alert("Vui lòng đăng nhập để bình luận");
        return;
      }
      const text = input.value.trim();
      if (!text) return;
      submitBtn.disabled = true;
      try {
        const created = await createComment(postId, text, null);
        if (created) {
          // Prepend new comment to the list
          const list = document.getElementById("commentsList");
          list.insertBefore(
            createCommentElement(created, postId),
            list.firstChild
          );
          input.value = "";
        }
      } catch (err) {
        console.error("Create comment failed:", err);
        alert("Không thể gửi bình luận");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
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
    summaryText.innerHTML = "Đang xử lý...";
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
    // Hiển thị HTML được trả về từ backend
    summaryText.innerHTML = result.summary;

    // Apply Prism.js syntax highlighting cho code blocks trong summary
    Prism.highlightAllUnder(summaryContainer);
  } catch (error) {
    console.error("Error summarizing:", error);
    summaryText.innerHTML = "<p>Lỗi: " + error.message + "</p>";
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
    // Check admin status before loading comments
    isCurrentUserAdmin = await checkAdminRole();

    // Fetch post data
    const post = await fetchPost(postId);

    // Render post
    renderPost(post);

    // Initialize comments (load and wire composer)
    await initComments(postId);

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

    // Setup bookmark dropdown
    initBookmarkDropdown(postId);
  } catch (error) {
    console.error("Error initializing post detail:", error);
    showError("Không thể tải bài viết. Vui lòng thử lại sau.");
  }
}

// ========== BOOKMARK DROPDOWN FUNCTIONS ==========

let bookmarkLists = [];
let selectedBookmarkListIds = new Set(); // Thay đổi từ single name sang Set of IDs
let isBookmarkDropdownOpen = false;
let savedBookmarkListIds = []; // IDs của các bookmark lists đã lưu post này

// Fetch bookmark lists từ API
async function fetchBookmarkLists() {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/bookmarks/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching bookmark lists:", error);
    return [];
  }
}

// Fetch danh sách bookmark list IDs chứa post này
async function fetchSavedBookmarkListIds(postId) {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${API_BASE_URL}/bookmarks/post/${postId}/lists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching saved bookmark list IDs:", error);
    return [];
  }
}

// Thêm post vào bookmark list
async function addPostToBookmark(listName, postId) {
  try {
    const token = getAuthToken();
    if (!token) {
      alert("Vui lòng đăng nhập để lưu bookmark");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/bookmarks/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      throw new Error(error.message || "Không thể lưu bookmark");
    }
  } catch (error) {
    console.error("Error adding post to bookmark:", error);
    throw error;
  }
}

// Render danh sách bookmark trong dropdown
function renderBookmarkDropdownList(lists) {
  const container = document.getElementById("bookmarkDropdownList");

  if (!lists || lists.length === 0) {
    container.innerHTML = `
      <div class="post-detail__bookmark-dropdown-empty">
        Chưa có bookmark list nào.<br/>
        <small>Tạo bookmark list trong trang Profile</small>
      </div>
    `;
    return;
  }

  container.innerHTML = lists
    .map((list) => {
      const isSelected = selectedBookmarkListIds.has(list.listId);
      const isSaved = savedBookmarkListIds.includes(list.listId);

      return `
        <button 
          class="post-detail__bookmark-dropdown-item ${
            isSelected || isSaved
              ? "post-detail__bookmark-dropdown-item--selected"
              : ""
          }" 
          data-list-id="${list.listId}"
          data-list-name="${list.name}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21L12 17L5 21V5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ${isSelected || isSaved ? 'fill="currentColor"' : ""}
            />
          </svg>
          <span>${list.name}</span>
          ${
            isSaved && !isSelected
              ? '<span class="post-detail__bookmark-saved-badge">Đã lưu</span>'
              : ""
          }
        </button>
      `;
    })
    .join("");
}

// Toggle bookmark dropdown
function toggleBookmarkDropdown() {
  const dropdown = document.getElementById("bookmarkDropdown");
  const saveBtn = document.getElementById("saveBookmarkBtn");

  if (isBookmarkDropdownOpen) {
    dropdown.style.display = "none";
    isBookmarkDropdownOpen = false;
  } else {
    dropdown.style.display = "block";
    isBookmarkDropdownOpen = true;

    // Reset selection (giữ lại trạng thái đã lưu)
    selectedBookmarkListIds.clear();
    saveBtn.disabled = true;

    // Load bookmark lists
    loadBookmarkDropdownLists();
  }
}

// Load bookmark lists vào dropdown
async function loadBookmarkDropdownLists() {
  const container = document.getElementById("bookmarkDropdownList");
  container.innerHTML =
    '<div class="post-detail__bookmark-dropdown-loading">Đang tải...</div>';

  const postId = getPostIdFromURL();

  // Fetch cả bookmark lists và danh sách đã lưu
  const [lists, savedIds] = await Promise.all([
    fetchBookmarkLists(),
    fetchSavedBookmarkListIds(postId),
  ]);

  bookmarkLists = lists;
  savedBookmarkListIds = savedIds;

  // Update bookmark button state nếu đã có bookmark
  if (savedIds.length > 0) {
    const bookmarkBtn = document.getElementById("bookmarkBtn");
    if (bookmarkBtn) {
      bookmarkBtn.classList.add("post-detail__bookmark-btn--active");
    }
  }

  renderBookmarkDropdownList(bookmarkLists);
}

// Handle chọn bookmark list trong dropdown (multi-select)
function handleSelectBookmarkList(listId, listName) {
  // Nếu đã được lưu sẵn thì không cho chọn lại
  if (savedBookmarkListIds.includes(listId)) {
    return;
  }

  // Toggle selection
  if (selectedBookmarkListIds.has(listId)) {
    selectedBookmarkListIds.delete(listId);
  } else {
    selectedBookmarkListIds.add(listId);
  }

  const saveBtn = document.getElementById("saveBookmarkBtn");
  saveBtn.disabled = selectedBookmarkListIds.size === 0;

  // Update UI
  renderBookmarkDropdownList(bookmarkLists);
}

// Handle lưu bookmark (multi-select)
async function handleSaveBookmark(postId) {
  if (selectedBookmarkListIds.size === 0) return;

  const saveBtn = document.getElementById("saveBookmarkBtn");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Đang lưu...";
  saveBtn.disabled = true;

  try {
    // Lưu vào tất cả bookmark lists đã chọn
    const selectedLists = bookmarkLists.filter((list) =>
      selectedBookmarkListIds.has(list.listId)
    );
    const promises = selectedLists.map((list) =>
      addPostToBookmark(list.name, postId)
    );

    const results = await Promise.all(promises);
    const successCount = results.filter((r) => r && r.success).length;

    if (successCount > 0) {
      // Update bookmark button để hiển thị đã bookmark
      const bookmarkBtn = document.getElementById("bookmarkBtn");
      bookmarkBtn.classList.add("post-detail__bookmark-btn--active");

      // Cập nhật savedBookmarkListIds
      selectedBookmarkListIds.forEach((id) => {
        if (!savedBookmarkListIds.includes(id)) {
          savedBookmarkListIds.push(id);
        }
      });

      // Đóng dropdown
      toggleBookmarkDropdown();

      // Thông báo thành công
      const listNames = selectedLists.map((l) => l.name).join(", ");
      alert(`Đã lưu bài viết vào: ${listNames}`);
    } else {
      alert("Không thể lưu bookmark");
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
  } catch (error) {
    alert(error.message);
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }
}

// Close dropdown khi click outside
function handleClickOutsideBookmarkDropdown(event) {
  const wrapper = document.querySelector(".post-detail__bookmark-wrapper");
  if (wrapper && !wrapper.contains(event.target) && isBookmarkDropdownOpen) {
    const dropdown = document.getElementById("bookmarkDropdown");
    dropdown.style.display = "none";
    isBookmarkDropdownOpen = false;
  }
}

// Load trạng thái bookmark ban đầu khi trang được tải
async function loadInitialBookmarkState(postId) {
  try {
    const token = getAuthToken();
    if (!token) return;

    const savedIds = await fetchSavedBookmarkListIds(postId);
    savedBookmarkListIds = savedIds;

    // Nếu đã có ít nhất 1 bookmark list lưu post này, highlight nút bookmark
    if (savedIds.length > 0) {
      const bookmarkBtn = document.getElementById("bookmarkBtn");
      if (bookmarkBtn) {
        bookmarkBtn.classList.add("post-detail__bookmark-btn--active");
      }
    }
  } catch (error) {
    console.error("Error loading initial bookmark state:", error);
  }
}

// Initialize bookmark dropdown
function initBookmarkDropdown(postId) {
  const bookmarkBtn = document.getElementById("bookmarkBtn");
  const saveBtn = document.getElementById("saveBookmarkBtn");
  const listContainer = document.getElementById("bookmarkDropdownList");
  const dropdown = document.getElementById("bookmarkDropdown");

  if (!bookmarkBtn) return;

  // Load trạng thái bookmark ban đầu
  loadInitialBookmarkState(postId);

  // Toggle dropdown khi click bookmark button
  bookmarkBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Check if logged in
    const token = getAuthToken();
    if (!token) {
      alert("Vui lòng đăng nhập để lưu bookmark");
      return;
    }

    toggleBookmarkDropdown();
  });

  // Prevent dropdown from closing when clicking inside
  if (dropdown) {
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Handle chọn bookmark list - dùng event delegation
  if (listContainer) {
    listContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = e.target.closest(".post-detail__bookmark-dropdown-item");
      if (item) {
        const listId = parseInt(item.dataset.listId);
        const listName = item.dataset.listName;
        if (listId && listName) {
          handleSelectBookmarkList(listId, listName);
        }
      }
    });
  }

  // Handle save button
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleSaveBookmark(postId);
    });
  }

  // Close dropdown khi click outside
  document.addEventListener("click", handleClickOutsideBookmarkDropdown);
}

// Init khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPostDetail);
} else {
  initPostDetail();
}

// ========== PAGINATION HANDLER - Xử lý phân trang bài viết ==========

// Cấu hình
const POSTS_PER_PAGE = 10;
let currentPage = 1;

// Lấy tất cả các bài viết
const allPosts = document.querySelectorAll(".post");
const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

// Hiển thị bài viết theo trang
function showPage(page, shouldScroll = false) {
  // Ẩn tất cả bài viết
  allPosts.forEach((post) => {
    post.style.display = "none";
  });

  // Tính toán index bắt đầu và kết thúc
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  // Hiển thị bài viết của trang hiện tại
  for (let i = startIndex; i < endIndex && i < allPosts.length; i++) {
    allPosts[i].style.display = "block";
  }

  // Chỉ scroll khi người dùng click vào nút phân trang
  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Cập nhật trạng thái các nút phân trang
function updatePagination() {
  // Cập nhật nút Trước/Sau
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  const nextBtn = document.querySelector(".pagination__btn:last-child");

  // Nút Trước
  if (currentPage === 1) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  // Nút Sau
  if (currentPage === totalPages) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }

  // Cập nhật các số trang
  const pageButtons = document.querySelectorAll(".pagination__page");
  pageButtons.forEach((btn, index) => {
    const pageNum = index + 1;
    if (pageNum === currentPage) {
      btn.classList.add("pagination__page--active");
    } else {
      btn.classList.remove("pagination__page--active");
    }
  });
}

// Xử lý khi click vào số trang
document.querySelectorAll(".pagination__page").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pageNum = parseInt(btn.textContent);
    currentPage = pageNum;
    showPage(currentPage, true);
    updatePagination();
  });
});

// Xử lý nút Trước
document
  .querySelector(".pagination__btn:first-child")
  .addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage, true);
      updatePagination();
    }
  });

// Xử lý nút Sau
document
  .querySelector(".pagination__btn:last-child")
  .addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage, true);
      updatePagination();
    }
  });

// Khởi tạo trang đầu tiên (không scroll)
showPage(currentPage, false);
updatePagination();

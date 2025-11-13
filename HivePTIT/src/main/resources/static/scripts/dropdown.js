// ========== DROPDOWN HANDLER - Xử lý các dropdown menu ==========

// Toggle dropdown chuyên mục
const topicDropdown = document.querySelector(".header__menu-item--dropdown");
const topicToggle = topicDropdown.querySelector(".header__dropdown-toggle");

topicToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  topicDropdown.classList.toggle("header__menu-item--open");
});

// Toggle dropdown người dùng
const userSection = document.querySelector(".header__user");
const avatarBtn = userSection.querySelector(".header__avatar-btn");

avatarBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  userSection.classList.toggle("header__user--open");
});

// Đóng dropdown khi click ra ngoài
document.addEventListener("click", () => {
  topicDropdown.classList.remove("header__menu-item--open");
  userSection.classList.remove("header__user--open");
});

// Ngăn đóng dropdown khi click vào menu
document
  .querySelector(".header__dropdown-menu")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

document.querySelector(".header__user-menu")?.addEventListener("click", (e) => {
  e.stopPropagation();
});

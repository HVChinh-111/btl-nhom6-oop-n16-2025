// ========== DROPDOWN HANDLER - Xử lý các dropdown menu ==========

// Toggle dropdown người dùng
const userSection = document.querySelector(".header__user");
if (userSection) {
  const avatarBtn = userSection.querySelector(".header__avatar-btn");

  if (avatarBtn) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userSection.classList.toggle("header__user--open");
    });
  }

  // Đóng dropdown khi click ra ngoài
  document.addEventListener("click", () => {
    userSection.classList.remove("header__user--open");
  });

  // Ngăn đóng dropdown khi click vào menu
  const userMenu = document.querySelector(".header__user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

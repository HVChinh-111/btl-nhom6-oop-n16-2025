const userSection = document.querySelector(".header__user");
if (userSection) {
  const avatarBtn = userSection.querySelector(".header__avatar-btn");

  if (avatarBtn) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userSection.classList.toggle("header__user--open");
    });
  }

  
  document.addEventListener("click", () => {
    userSection.classList.remove("header__user--open");
  });

  
  const userMenu = document.querySelector(".header__user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}
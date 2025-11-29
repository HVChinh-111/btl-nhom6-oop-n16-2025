const POSTS_PER_PAGE = 10;
let currentPage = 1;

const allPosts = document.querySelectorAll(".post");
const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

function showPage(page, shouldScroll = false) {
  
  allPosts.forEach((post) => {
    post.style.display = "none";
  });

  
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  
  for (let i = startIndex; i < endIndex && i < allPosts.length; i++) {
    allPosts[i].style.display = "block";
  }

  
  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updatePagination() {
  
  const prevBtn = document.querySelector(".pagination__btn:first-child");
  const nextBtn = document.querySelector(".pagination__btn:last-child");

  
  if (currentPage === 1) {
    prevBtn.classList.add("pagination__btn--disabled");
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove("pagination__btn--disabled");
    prevBtn.disabled = false;
  }

  
  if (currentPage === totalPages) {
    nextBtn.classList.add("pagination__btn--disabled");
    nextBtn.disabled = true;
  } else {
    nextBtn.classList.remove("pagination__btn--disabled");
    nextBtn.disabled = false;
  }

  
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

document.querySelectorAll(".pagination__page").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pageNum = parseInt(btn.textContent);
    currentPage = pageNum;
    showPage(currentPage, true);
    updatePagination();
  });
});

document
  .querySelector(".pagination__btn:first-child")
  .addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage, true);
      updatePagination();
    }
  });

document
  .querySelector(".pagination__btn:last-child")
  .addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage, true);
      updatePagination();
    }
  });

showPage(currentPage, false);
updatePagination();
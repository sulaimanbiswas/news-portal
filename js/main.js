const categoryNameData = () => {
  const url = `https://openapi.programming-hero.com/api/news/categories`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategoryList(data.data.news_category))
    .catch((error) => console.log(error));
};

const displayCategoryList = (categories) => {
  const categoryContainer = document.getElementById("newsCategoryContainer");
  categories.forEach((category) => {
    const a = document.createElement("a");
    a.classList.add("nav-link");
    a.setAttribute("onclick", `getCategoryData(${category.category_id})`);
    a.setAttribute("href", `#`);
    a.innerText = `${category.category_name}`;
    categoryContainer.appendChild(a);
  });
};

categoryNameData();

const getCategoryData = (categoryId) => {
  const url = `https://openapi.programming-hero.com/api/news/category/0${categoryId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategoryDetails(data.data))
    .catch((error) => console.log(error));

  togglePreloader(true);
};
const displayCategoryDetails = (posts) => {
  // Sort By View
  posts.sort(byView);
  function byView(a, b) {
    return parseInt(b.total_view - a.total_view);
  }

  document.getElementById("post-counter").innerText = posts.length;
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";
  posts.forEach((post) => {
    const article = document.createElement("article");
    article.innerHTML = `
    <div onclick="postDetails('${post._id}')" class="card mb-3 post" data-bs-toggle="modal" data-bs-target="#postDetailsModal">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${post.image_url}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.details.slice(0, 200)}...</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <img src="${post.author.img}" class="author-img" alt="">
                            <div class="ps-3">
                                <p class="m-0">${post.author.name ? post.author.name : "no publisher found"}</p>
                                <p class="m-0"><small>${post.author.published_date ? post.author.published_date : "no publish date"}</small></p>
                            </div>
                        </div>
                        <div class="">
                            <i class="fa-solid fa-eye"></i> <span>${post.total_view ? post.total_view : 0}</span>
                        </div>
                        <div class="d-none d-sm-block">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star-half-stroke"></i>
                        </div>
                        <div class="" data-bs-toggle="modal" data-bs-target="#postDetailsModal">
                            <i class="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    postContainer.appendChild(article);
  });
  togglePreloader(false);
};

// Preloader
const togglePreloader = (loader) => {
  const preloader = document.getElementById("preloader");
  if (loader === true) {
    preloader.classList.remove("d-none");
  } else {
    preloader.classList.add("d-none");
  }
};
// End Preloader
getCategoryData(8);
const postDetails = async (news_id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    displayPostDetails(data.data[0]);
  } catch (error) {
    console.log(error);
  }
};
const displayPostDetails = (post) => {
  document.getElementById("postDetailsModalLabel").innerText = `${post.title}`;
  const postDetailsModalBody = document.getElementById("postDetailsModalBody");
  postDetailsModalBody.innerHTML = `
    <div class="mb-3">
        <small class="text-muted mb-3">Last updated ${post.author.published_date ? post.author.published_date : "no publish date"}</small>
    </div>
    <div class="card mb-3">
        <img src="${post.image_url}" class="card-img-top" alt="...">
        <div class="card-body">
            <p class="card-text">${post.details}</p>

        </div>
        <div class="d-flex align-items-center justify-content-between p-3">
            <div class="d-flex align-items-center">
                <img src="${post.author.img}" class="author-img" alt="">
                <div class="ps-3">
                    <p class="m-0">${post.author.name ? post.author.name : "no publisher found"}</p>
                </div>
            </div>
            <div class="">
                <i class="fa-solid fa-eye"></i> <span>${post.total_view ? post.total_view : 0}</span>
            </div>
            <div class="d-none d-sm-block ">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star-half-stroke"></i>
            </div>
        </div>
    </div>
  `;
};

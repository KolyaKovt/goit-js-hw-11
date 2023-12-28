import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import errorIcon from "/close-message.svg";

const form = document.getElementById("form");
const loader = document.querySelector(".loader");
const input = form.elements.userInput;
const imagesList = document.getElementById("results");

// light create SimpleLightBox
const lightbox = new SimpleLightbox("#results .card-link", {
  captionDelay: 250,
  captionsData: "alt",
});

form.addEventListener("submit", evt => {
  evt.preventDefault();
  const separateSign = "+";
  const q = input.value
    .trim()
    .replace(" ", separateSign)
    .replace(",", separateSign);

  imagesList.innerHTML = "";
  loader.style.display = "block";

  fetch(
    `https://pixabay.com/api/?key=41489531-fbd647ce3ca134c20e68a1b0d&q=${q}&orientation=horizontal%safesearch=true&image_type=photo`
  )
    .then(answer => answer.json())
    .then(res => {
      const hits = res.hits;

      if (hits.length === 0) {
        showError(
          "Sorry, there are no images matching your search query. Please try again!"
        );

        return;
      }

      fillImagesList(hits);

      form.reset();
    })
    .catch(err => {
      console.error(err);
      showError("Something unexpected happened! Check the console.");
    })
    .finally(() => {
      loader.style.display = "none";
    });
});

function showError(errorText) {
  iziToast.error({
    message: errorText,
    maxWidth: "380px",
    messageSize: 16,
    position: "topRight",
    iconUrl: errorIcon,
    theme: "dark",
    color: "#fff",
    backgroundColor: "#EF4040",
    messageColor: "#fff",
    titleColor: "#fff",
    iconColor: "#fff",
  });
}

function fillImagesList(hits) {
  const listItems = [];

  hits.forEach(hit => {
    const li = document.createElement("li");
    li.className = "results-item";
    li.innerHTML = `
    <a class="card-link" href="${hit.largeImageURL}">
      <img class="card-image" src="${hit.webformatURL}" alt="${hit.tags}" />
    </a>
    <table class="image-description-table">
      <tr class="description-row">
        <th class="description-column">Likes</th>
        <th class="description-column">Views</th>
        <th class="description-column">Comments</th>
        <th class="description-column">Downloads</th>
      </tr>
      <tr class="description-row">
        <td class="description-column">${hit.likes}</td>
        <td class="description-column">${hit.views}</td>
        <td class="description-column">${hit.comments}</td>
        <td class="description-column">${hit.downloads}</td>
      </tr>
    </table>
    `;

    listItems.push(li);
  });

  imagesList.append(...listItems);

  lightbox.refresh();
}

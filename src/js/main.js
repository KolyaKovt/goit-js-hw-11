import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.getElementById("form");
const input = form.elements.userInput;
const imagesList = document.getElementById("images");

form.addEventListener("submit", evt => {
  evt.preventDefault();
  const separateSign = "+";
  const q = input.value
    .trim()
    .replace(" ", separateSign)
    .replace(",", separateSign);

  fetch(
    `https://pixabay.com/api/?key=41489531-fbd647ce3ca134c20e68a1b0d&q=${q}&orientation=horizontal%safesearch=true&image_type=photo`
  )
    .then(answer => answer.json())
    .then(res => {
      const hits = res.hits;

      if (hits.length === 0) {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          maxWidth: "380px",
          messageSize: 16,
          position: "topRight",
          iconUrl: "/close-message.svg",
          theme: "dark",
          color: "#fff",
          backgroundColor: "#EF4040",
          messageColor: "#fff",
          titleColor: "#fff",
          iconColor: "#fff",
        });

        return;
      }

      const listItems = [];

      hits.forEach(hit => {
        const a = document.createElement("a");
        a.className = "card-link";
        a.href = `${hit.largeImageURL}`;
        a.innerHTML = `
        <img class="image" src="${hit.webformatURL}" alt="${hit.tags}" />
        <table class="image-desciption-table">
          <tr class="tr">
            <th>Likes</th>
            <th>Views</th>
            <th>Comments</th>
            <th>Downloads</th>
          </tr>
          <tr class="tr">
            <td>${hit.likes}</td>
            <td>${hit.views}</td>
            <td>${hit.comments}</td>
            <td>${hit.downloads}</td>
          </tr>
        </table>
        `;

        listItems.push(a);
      });

      imagesList.innerHTML = "";
      imagesList.append(...listItems);

      const lightbox = new SimpleLightbox(".images-list .card-link", {
        captionDelay: 250,
        captionsData: "alt"
      });
      
      form.reset();
    })
    .catch(err => {
      console.error(err);
    });

});

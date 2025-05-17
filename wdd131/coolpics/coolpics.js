

const menu = document.querySelector(".menu");

const menuButton = document.querySelector(".menu-button");
menuButton.addEventListener("click", () => {menu.classList.toggle("hide")});


function handleResize() {
  if (window.innerWidth > 1000) {
    menu.classList.remove("hide");
  } else {
    menu.classList.add("hide");
  }
}
handleResize();
window.addEventListener("resize", handleResize);


const gallery = document.querySelector('.gallery');

gallery.addEventListener('click', (event) => {
  const clickedImg = event.target.closest('img');

  const dialog = document.createElement('dialog');
  dialog.classList.add('image-viewer');

  const imageName = clickedImg.src.split('/')[6];
  const norrisPart = imageName.split('-')[0];
  const fullSrc = `${norrisPart}-full.jpeg`;
  dialog.innerHTML = `
    <img src="${fullSrc}" alt="${clickedImg.alt}">
    <button class="close-viewer">X</button>
  `;


  dialog.querySelector('.close-viewer').addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });


  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });


  document.body.appendChild(dialog);
  dialog.showModal();
});

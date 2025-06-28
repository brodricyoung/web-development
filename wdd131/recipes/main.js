import recipes from './recipes.mjs';


function getRandomNumber(max) {
    return Math.floor(Math.random()*(max - 1)); // will give a number 0-4
}

function getRandomArrayItem(array) {
    const randomNum = getRandomNumber(array.length);
    return array[randomNum];
}


function tagsTemplate(tags) {
	// loop through the tags list and transform the strings to HTML
    let html = ``;
    for (const tag of tags){
        html += `<li>${tag}</li>`
    }
	return html;
}

function ratingTemplate(rating) {
	// begin building an html string using the ratings HTML written earlier as a model.
	let html = `
        <span
            class="rating"
            role="img"
            aria-label="Rating: ${rating} out of 5 stars"
        >`
    // our ratings are always out of 5, so create a for loop from 1 to 5
    for (let i = 1; i <= 5; i++){
        // check to see if the current index of the loop is less than our rating
        if (i <= rating) {
            // if so then output a filled star
            html += `<span aria-hidden="true" class="icon-star">★</span>`;
        } else {
            // else output an empty star
            html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
        }
    }
	// after the loop, add the closing tag to our string
	html += `</span>`
	// return the html string
	return html
}


function recipeTemplate(recipeList) {
	let html = ``;
    for (const recipe of recipeList) {
        html += `
            <figure class="recipebox">
                <img src="${recipe.image}" alt="image of ${recipe.name}">
                <figcaption class="recipecontent">
                    <ul class="tagsbox">
                        ${tagsTemplate(recipe.tags)}
                    </ul>
                    <h2 class="name">${recipe.name}</h2>
                    ${ratingTemplate(recipe.rating)}
                    <p class="description">${recipe.description}</p>
                </figcaption>
            </figure>
        `
    }
    return html;
}


function renderRecipes(recipeList) {
	// get the element we will output the recipes into
    const mainElement = document.querySelector("main");
	// use the recipeTemplate function to transform our recipe objects into recipe HTML strings
    const html = recipeTemplate(recipeList)
	// Set the HTML strings as the innerHTML of our output element.
    mainElement.innerHTML = html;
}

function init() {
  // get a random recipe
  const recipe = getRandomArrayItem(recipes)
  // render the recipe with renderRecipes.
  renderRecipes([recipe]);
}
init();


const searchButton = document.querySelector("button");
searchButton.addEventListener("click", searchHandler);

function searchHandler(event) {
    event.preventDefault();
    const searchinput = document.querySelector("input").value.toLowerCase();
    const filtered = recipes.filter(recipe => filterRecipes(recipe, searchinput));
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
    renderRecipes(sorted);
}

function filterRecipes(recipe, query) {
    return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.tags.find((tag) => tag.toLowerCase().includes(query)) ||
        recipe.recipeIngredient.find((ingredient) => ingredient.toLowerCase().includes(query))
    )
}


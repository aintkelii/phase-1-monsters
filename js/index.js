document.addEventListener("DOMContentLoaded", () => {
  const monstersContainer = document.getElementById("monster-container");
  const createMonster = document.getElementById("create-monster");
  const loadMoreBtn = document.getElementById("load-more");
  let currentPage = 1;

  // Initialize the page
  function init() {
    createMonsterForm();
    loadMonsters();
  }

  // Create the monster form
  function createMonsterForm() {
    const form = document.createElement("form");
    form.id = "monster-form";

    form.innerHTML = `
      <input id="name" placeholder="Name...">
      <input id="age" placeholder="Age..." type="number">
      <input id="description" placeholder="Description...">
      <button type="submit">Create Monster</button>
    `;

    form.addEventListener("submit", handleCreateMonster);
    createMonster.appendChild(form);
  }

  // Handle form submission
  function handleCreateMonster(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector("#name").value;
    const age = parseFloat(form.querySelector("#age").value);
    const description = form.querySelector("#description").value;

    if (name && !isNaN(age) && description) {
      const monsterData = { name, age, description };

      fetch("http://localhost:3000/monsters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(monsterData),
      })
        .then((response) => response.json())
        .then((newMonster) => {
          addMonsterToDOM(newMonster);
          form.reset();
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  // Load monsters from API
  function loadMonsters() {
    fetch(`http://localhost:3000/monsters/?_limit=50&_page=${currentPage}`)
      .then((response) => response.json())
      .then((monsters) => {
        if (monsters.length === 0) {
          loadMoreBtn.disabled = true;
          loadMoreBtn.textContent = "No More Monsters";
        } else {
          monsters.forEach(addMonsterToDOM);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  // Add a monster to the DOM
  function addMonsterToDOM(monster) {
    const monsterDiv = document.createElement("div");
    monsterDiv.className = "monster-card";
    monsterDiv.innerHTML = `
      <h2>${monster.name}</h2>
      <h4>Age: ${monster.age.toFixed(2)}</h4>
      <p>${monster.description}</p>
    `;
    monstersContainer.appendChild(monsterDiv);
  }

  // Load more monsters when button is clicked
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadMonsters();
  });

  // Initialize the application
  init();
});

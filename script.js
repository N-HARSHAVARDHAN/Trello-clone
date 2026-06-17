async function getLists() {
  try {
    const res = await fetch(
      `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${TOKEN}`
    );
    const data = await res.json();
    renderLists(data);
  } catch (err) {
    console.error(err);
  }
}

function renderLists(lists) {
  const container = document.getElementById("listsContainer");
  container.querySelectorAll(".list").forEach(el => el.remove());

  lists.forEach(list => {
    const div = document.createElement("div");
    div.className = "list";

    div.innerHTML = `
      <div class="list-header">
        <h3>${list.name}</h3>
        <div class="list-actions">
          <button onclick="renameList('${list.id}')">Rename</button>
          <button onclick="deleteList('${list.id}')">Delete</button>
        </div>
      </div>
      <div id="cards-${list.id}"></div>
      <button class="add-card-btn" onclick="addCard('${list.id}')">+ Add a card</button>
      
    `;

    container.appendChild(div);
    getCards(list.id);
  });

  const btn = document.getElementById("createListBtn");
  container.appendChild(btn);
}

async function createList(name) {
  await fetch(
    `https://api.trello.com/1/lists?name=${name}&idBoard=${BOARD_ID}&pos=bottom&key=${API_KEY}&token=${TOKEN}`,
    { method: "POST" }
  );
  getLists();
}

async function renameList(listId) {
  const name = await openModal("Enter new name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/lists/${listId}?name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  getLists();
}

async function deleteList(listId) {
  await fetch(
    `https://api.trello.com/1/lists/${listId}/closed?value=true&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  getLists();
}

async function getCards(listId) {
  const res = await fetch(
    `https://api.trello.com/1/lists/${listId}/cards?key=${API_KEY}&token=${TOKEN}`
  );
  const cards = await res.json();
  renderCards(listId, cards);
}

function renderCards(listId, cards) {
  const container = document.getElementById(`cards-${listId}`);
  container.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="card-top">
        <p class="card-name">${card.name}</p>
      </div>
    `;
    div.addEventListener("click", () => openCardModal(card.id, listId, card.name));
    container.appendChild(div);
  });
}

async function addCard(listId) {
  const name = await openModal("Card Name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/cards?idList=${listId}&name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "POST" }
  );
  getCards(listId);
}

async function renameCard(cardId, listId) {
  const name = await openModal("New Name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  getCards(listId);
}

async function archiveCard(cardId, listId) {
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?closed=true&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  getCards(listId);
}

let currentCardId = null;
let currentListId = null;

function openCardModal(cardId, listId, cardName) {
  currentCardId = cardId;
  currentListId = listId;

  document.getElementById("cardTitle").textContent = cardName;
  document.getElementById("cardOverlay").style.display = "flex";
  renderModalChecklists(cardId);
}

function closeCardModalFn() {
  document.getElementById("cardOverlay").style.display = "none";
  currentCardId = null;
  currentListId = null;
}

document.getElementById("closeCardModal").addEventListener("click", closeCardModalFn);

document.getElementById("renameCardBtn").addEventListener("click", async () => {
  if (!currentCardId) return;
  const name = await openModal("New Name");
  if (!name) return;
  await renameCard(currentCardId,currentListId);
  document.getElementById("cardTitle").textContent = name;
  getCards(currentListId);
});

document.getElementById("archiveCardBtn").addEventListener("click", async () => {
  if (!currentCardId) return;
  await archiveCard(currentCardId, currentListId);
  closeCardModalFn();
});

document.getElementById("checklistCardBtn").addEventListener("click", async () => {
  if (!currentCardId) return;
  await addChecklist(currentCardId, currentListId);
});

async function renderModalChecklists(cardId) {
  const res = await fetch(
    `https://api.trello.com/1/cards/${cardId}/checklists?key=${API_KEY}&token=${TOKEN}`
  );
  const checklists = await res.json();

  const container = document.getElementById("modalChecklists");
  container.innerHTML = "";

  checklists.forEach(checklist => {
    const div = document.createElement("div");
    div.className = "checklist";
    div.innerHTML = `
      <h4>${checklist.name}</h4>
      <div class="checklist-actions">
        <button onclick="renameChecklist('${checklist.id}','${cardId}')">Rename</button>
        <button onclick="deleteChecklist('${checklist.id}','${cardId}')">Delete</button>
        <button onclick="addCheckItem('${checklist.id}','${cardId}')">+ Item</button>
      </div>
      <div id="items-${checklist.id}"></div>
    `;
    container.appendChild(div);
    renderCheckItems(checklist, cardId);
  });
}

async function addChecklist(cardId, listId) {
  const name = await openModal("Checklist Name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/checklists?idCard=${cardId}&name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "POST" }
  );
  renderModalChecklists(cardId);
}

async function deleteChecklist(checklistId, cardId) {
  await fetch(
    `https://api.trello.com/1/checklists/${checklistId}?key=${API_KEY}&token=${TOKEN}`,
    { method: "DELETE" }
  );
  renderModalChecklists(cardId);
}

async function renameChecklist(checklistId, cardId) {
  const name = await openModal("New Name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/checklists/${checklistId}?name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  renderModalChecklists(cardId);
}

function renderCheckItems(checklist, cardId) {
  const container = document.getElementById(`items-${checklist.id}`);
  container.innerHTML = "";

  checklist.checkItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "check-item";
    div.innerHTML = `
      <input
        type="checkbox"
        ${item.state === "complete" ? "checked" : ""}
        onchange="toggleCheckItem('${cardId}', '${item.id}',this.checked)"
      >
      <span style="${item.state === 'complete' ? 'text-decoration: line-through; color: #8c9bab;' : ''}">${item.name}</span>
      <div class="check-item-actions">
        <button onclick="deleteCheckItem('${checklist.id}', '${item.id}','${cardId}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function addCheckItem(checklistId, cardId) {
  const name = await openModal("Item Name");
  if (!name) return;
  await fetch(
    `https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${name}&key=${API_KEY}&token=${TOKEN}`,
    { method: "POST" }
  );
  renderModalChecklists(cardId);
}

async function deleteCheckItem(checklistId, itemId, cardId) {
  await fetch(
    `https://api.trello.com/1/checklists/${checklistId}/checkItems/${itemId}?key=${API_KEY}&token=${TOKEN}`,
    { method: "DELETE" }
  );
  renderModalChecklists(cardId);
}

async function toggleCheckItem(cardId, itemId, checked) {
  const state = checked ? "complete" : "incomplete";
  await fetch(
    `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${state}&key=${API_KEY}&token=${TOKEN}`,
    { method: "PUT" }
  );
  renderModalChecklists(cardId);
}

document.getElementById("createListBtn").addEventListener("click", async () => {
  const name = await openModal("List Name");
  if (name) createList(name);
});

function openModal(title) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("modalOverlay");
    const input = document.getElementById("modalInput");
    const modalTitle = document.getElementById("modalTitle");
    const save = document.getElementById("modalSave");
    const cancel = document.getElementById("modalCancel");

    modalTitle.textContent = title;
    input.value = "";
    overlay.style.display = "flex";
    input.focus();

    save.onclick = () => {
      overlay.style.display = "none";
      resolve(input.value);
    };

    cancel.onclick = () => {
      overlay.style.display = "none";
      resolve(null);
    };
  });
}

getLists();
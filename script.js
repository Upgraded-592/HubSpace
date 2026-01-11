/* ================= ELEMENTS ================= */
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const addHubBtn = document.getElementById("addHubBtn");
const newHubInput = document.getElementById("newHubInput");
const addSpaceBtn = document.getElementById("addSpaceBtn");
const newSpaceInput = document.getElementById("newSpaceInput");
const hubList = document.getElementById("hubList");

/* ================= DATA ================= */
const STORAGE_KEY = "hubspaces-data";
let hubs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  Discord: [
    {
      name: "General Chat",
      messages: [
        { text: "Hey everyone! How is the project going?", from: "them" },
        { text: "Going well! Just finished the frontend.", from: "me" }
      ]
    }
  ],
  WhatsApp: [
    {
      name: "Family",
      messages: [
        { text: "Dinner at 7?", from: "them" }
      ]
    }
  ]
};

let currentHub = "Discord";
let currentSpace = null;

/* ================= INIT ================= */
document.getElementById("app").classList.remove("hidden");

/* ================= SAVE ================= */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hubs));
}

/* ================= HUBS ================= */
function renderHubs() {
  hubList.innerHTML = "";
  Object.keys(hubs).forEach(hub => {
    const div = document.createElement("div");
    div.className = "hub";
    div.textContent = hub;
    div.onclick = (e) => selectHub(hub, e);
    hubList.appendChild(div);
  });
}

function selectHub(hub, event) {
  currentHub = hub;
  currentSpace = null;
  document.querySelectorAll(".hub").forEach(h => h.classList.remove("active"));
  event.target.classList.add("active");
  renderSpaces();
}

function addHub() {
  const hubName = newHubInput.value.trim();
  if (!hubName) return;
  if (hubs[hubName]) {
    alert("Platform already exists!");
    return;
  }
  hubs[hubName] = [];
  save();
  renderHubs();
  newHubInput.value = "";
}

addHubBtn.onclick = addHub;
newHubInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addHub();
});

/* ================= SPACES ================= */
function renderSpaces() {
  const list = document.getElementById("spaceList");
  list.innerHTML = "";

  hubs[currentHub].forEach(space => {
    const div = document.createElement("div");
    div.className = "space";
    div.innerHTML = `
      <div class="space-title">${space.name}</div>
      <div class="space-preview">${space.messages.at(-1)?.text || ""}</div>
    `;
    div.onclick = () => openSpace(space, div);
    list.appendChild(div);
  });
}

function addSpace() {
  if (!currentHub) {
    alert("Select a hub first!");
    return;
  }

  const spaceName = newSpaceInput.value.trim();
  if (!spaceName) return;

  if (hubs[currentHub].some(space => space.name === spaceName)) {
    alert("This space already exists!");
    return;
  }

  hubs[currentHub].push({
    name: spaceName,
    messages: []
  });

  save();
  renderSpaces();
  newSpaceInput.value = "";
}

addSpaceBtn.onclick = addSpace;
newSpaceInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addSpace();
});

/* ================= CHAT ================= */
function openSpace(space, el) {
  currentSpace = space;
  document.querySelectorAll(".space").forEach(s => s.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("chatHeader").textContent = space.name;
  renderMessages();
}

function renderMessages() {
  const msgBox = document.getElementById("messages");
  msgBox.innerHTML = "";
  currentSpace.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = `message ${m.from === "me" ? "sent" : "received"}`;
    div.textContent = m.text;
    msgBox.appendChild(div);
  });
  msgBox.scrollTop = msgBox.scrollHeight;
}

/* ================= SEND MESSAGES ================= */
sendBtn.onclick = () => {
  if (!currentSpace || !messageInput.value.trim()) return;

  currentSpace.messages.push({
    text: messageInput.value,
    from: "me"
  });

  save();
  messageInput.value = "";
  renderMessages();
}

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

/* ================= START ================= */
renderHubs();
selectHub("Discord");

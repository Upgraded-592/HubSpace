/* ELEMENTS */
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

/* DATA */
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

/* INIT APP */
document.getElementById("app").classList.remove("hidden");

/* HUBS */
const hubList = document.getElementById("hubList");
Object.keys(hubs).forEach(hub => {
  const div = document.createElement("div");
  div.className = "hub";
  div.textContent = hub;
  div.onclick = (e) => selectHub(hub, e);
  hubList.appendChild(div);
});

function selectHub(hub, event) {
  currentHub = hub;
  currentSpace = null;
  document.querySelectorAll(".hub").forEach(h => h.classList.remove("active"));
  event.target.classList.add("active");
  renderSpaces();
}

/* SPACES */
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

/* CHAT */
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

/* SEND */
sendBtn.onclick = () => {
  if (!currentSpace || !messageInput.value) return;

  currentSpace.messages.push({
    text: messageInput.value,
    from: "me"
  });

  save();
  messageInput.value = "";
  renderMessages();
};

/* SAVE */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hubs));
}

/* START */
selectHub("Discord");

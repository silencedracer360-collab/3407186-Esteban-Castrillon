const entityData = {
  name: "UrbanGo",
  description: "Aplicación de mensajería urbana para envíos rápidos y seguros dentro de la ciudad.",
  identifier: "URB-001",

  contact: {
    email: "contacto@urbango.app",
    phone: "+57 300 123 4567",
    location: "Bogotá, Colombia"
  },

  items: [
    { name: "Envíos express", level: 90 },
    { name: "Entrega en moto", level: 85 },
    { name: "Entrega en bicicleta", level: 75 },
    { name: "Seguimiento en tiempo real", level: 80 },
    { name: "Pagos digitales", level: 88 }
  ],

  links: [
    { platform: "Instagram", url: "https://instagram.com/urbango", icon: "📸" },
    { platform: "WhatsApp", url: "https://wa.me/573001234567", icon: "💬" }
  ],

  stats: {
    total: 1200,
    active: 45,
    rating: 4.7,
    custom: 15
  }
};

const userName = document.getElementById("userName");
const userTitle = document.getElementById("userTitle");
const userLocation = document.getElementById("userLocation");
const userBio = document.getElementById("userBio");
const userEmail = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");

const skillsList = document.getElementById("skillsList");
const socialLinks = document.getElementById("socialLinks");
const statsContainer = document.getElementById("stats");

const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyEmailBtn");
const toggleItemsBtn = document.getElementById("toggleSkills");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const renderBasicInfo = () => {
  const {
    name,
    description,
    contact: { email, phone, location }
  } = entityData;

  userName.textContent = name;
  userTitle.textContent = "Urban Messaging App";
  userLocation.textContent = `📍 ${location}`;
  userBio.textContent = description;
  userEmail.textContent = email;
  userPhone.textContent = phone;
};

const renderItems = (showAll = false) => {
  const { items } = entityData;
  const itemsToShow = showAll ? items : items.slice(0, 4);

  skillsList.innerHTML = itemsToShow
    .map(({ name, level }) => `
      <div class="skill-item">
        <div class="skill-name">${name}</div>
        <div class="skill-level">
          <span>${level}%</span>
          <div class="skill-bar">
            <div class="skill-bar-fill" style="width: ${level}%"></div>
          </div>
        </div>
      </div>
    `)
    .join("");
};

const renderLinks = () => {
  const { links } = entityData;

  socialLinks.innerHTML = links
    .map(link => `
      <a class="social-link" href="${link.url}" target="_blank">
        ${link.icon} ${link.platform}
      </a>
    `)
    .join("");
};

const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: "Envíos", value: stats.total },
    { label: "Mensajeros activos", value: stats.active },
    { label: "Rating", value: stats.rating },
    { label: "Ciudades", value: stats.custom }
  ];

  statsContainer.innerHTML = statsArray
    .map(stat => `
      <div class="stat-item">
        <span class="stat-value">${stat.value}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    `)
    .join("");
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
};

const copyInfo = () => {
  const { name, description, contact } = entityData;

  const text = `
${name}
${description}
Contacto: ${contact.email}
`.trim();

  navigator.clipboard.writeText(text);
  showToast("¡Información copiada!");
};

const showToast = message => {
  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);
};

let showingAllItems = false;

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleItemsBtn.textContent = showingAllItems ? "Mostrar menos" : "Mostrar más";
};

themeToggle.addEventListener("click", toggleTheme);
copyBtn.addEventListener("click", copyInfo);
toggleItemsBtn.addEventListener("click", handleToggleItems);

const init = () => {
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log("✅ UrbanGo inicializada correctamente");
};

init();
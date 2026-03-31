const API_BASE = "/api";

const state = {
  token: localStorage.getItem("craft_token") || null,
  user: JSON.parse(localStorage.getItem("craft_user") || "null"),
  properties: [],
  favourites: [],
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  authPage: $("#auth-page"),
  dashboardPage: $("#dashboard-page"),
  loginFormContainer: $("#login-form-container"),
  registerFormContainer: $("#register-form-container"),
  loginForm: $("#login-form"),
  registerForm: $("#register-form"),
  loginBtn: $("#login-btn"),
  registerBtn: $("#register-btn"),
  showRegister: $("#show-register"),
  showLogin: $("#show-login"),
  logoutBtn: $("#logout-btn"),
  navUserName: $("#nav-user-name"),
  navUserRole: $("#nav-user-role"),
  navAvatar: $("#nav-avatar"),
  greeting: $("#greeting"),
  statTotal: $("#stat-total"),
  statFavs: $("#stat-favs"),
  statRole: $("#stat-role"),
  propertiesGrid: $("#properties-grid"),
  favouritesGrid: $("#favourites-grid"),
  emptyProperties: $("#empty-properties"),
  emptyFavourites: $("#empty-favourites"),
  addPropertyForm: $("#add-property-form"),
  addPropertyBtn: $("#add-property-btn"),
  toastContainer: $("#toast-container"),
};

async function api(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) {
    headers["Authorization"] = `Bearer ${state.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}

function showToast(message, type = "info") {
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showAuth() {
  dom.authPage.classList.remove("hidden");
  dom.dashboardPage.classList.add("hidden");
}

function showDashboard() {
  dom.authPage.classList.add("hidden");
  dom.dashboardPage.classList.remove("hidden");
  updateUserUI();
  loadDashboardData();
}

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML =
      '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span>';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || btn.textContent;
  }
}

dom.showRegister.addEventListener("click", () => {
  dom.loginFormContainer.classList.add("hidden");
  dom.registerFormContainer.classList.remove("hidden");
});

dom.showLogin.addEventListener("click", () => {
  dom.registerFormContainer.classList.add("hidden");
  dom.loginFormContainer.classList.remove("hidden");
});

dom.registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#register-name").value.trim();
  const email = $("#register-email").value.trim();
  const password = $("#register-password").value;

  if (!name || !email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  setLoading(dom.registerBtn, true);
  try {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    showToast("Account created! Please sign in.", "success");
    dom.registerForm.reset();
    dom.registerFormContainer.classList.add("hidden");
    dom.loginFormContainer.classList.remove("hidden");
    $("#login-email").value = email;
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    setLoading(dom.registerBtn, false);
  }
});

// Login
dom.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#login-email").value.trim();
  const password = $("#login-password").value;

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  setLoading(dom.loginBtn, true);
  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("craft_token", data.token);
    localStorage.setItem("craft_user", JSON.stringify(data.user));
    showToast(`Welcome back, ${data.user.name}!`, "success");
    showDashboard();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    setLoading(dom.loginBtn, false);
  }
});

dom.logoutBtn.addEventListener("click", () => {
  state.token = null;
  state.user = null;
  localStorage.removeItem("craft_token");
  localStorage.removeItem("craft_user");
  showToast("You have been logged out", "info");
  showAuth();
  dom.loginForm.reset();
});

function updateUserUI() {
  if (!state.user) return;
  dom.navUserName.textContent = state.user.name;
  dom.navUserRole.textContent = state.user.role;
  dom.navAvatar.textContent = state.user.name.charAt(0).toUpperCase();
  dom.greeting.textContent = `Welcome back, ${state.user.name}!`;
  dom.statRole.textContent = capitalise(state.user.role);
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadDashboardData() {
  try {
    const [properties, favourites] = await Promise.all([
      api("/properties"),
      api("/favourite"),
    ]);
    state.properties = properties;
    state.favourites = favourites;

    renderProperties();
    renderFavourites();
    updateStats();
  } catch (err) {
    if (
      err.message.includes("token") ||
      err.message.includes("denied") ||
      err.message.includes("expired")
    ) {
      showToast("Session expired. Please log in again.", "error");
      dom.logoutBtn.click();
      return;
    }
    showToast("Failed to load data: " + err.message, "error");
  }
}

function updateStats() {
  dom.statTotal.textContent = state.properties.length;
  dom.statFavs.textContent = state.favourites.length;
}

function renderProperties() {
  const grid = dom.propertiesGrid;
  grid.innerHTML = "";

  if (state.properties.length === 0) {
    dom.emptyProperties.classList.remove("hidden");
    return;
  }
  dom.emptyProperties.classList.add("hidden");

  state.properties.forEach((prop, idx) => {
    const card = createPropertyCard(prop, idx);
    grid.appendChild(card);
  });
}

function createPropertyCard(prop, idx) {
  const card = document.createElement("div");
  card.className = "property-card";
  card.style.animationDelay = `${idx * 0.06}s`;

  const imageContent = prop.image_url
    ? `<img src="${escapeHtml(prop.image_url)}" alt="${escapeHtml(prop.title)}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-img\\'>🏠</div>'">`
    : `<div class="placeholder-img">🏠</div>`;

  const locationHtml = prop.location
    ? `<div class="property-location">📍 ${escapeHtml(prop.location)}</div>`
    : `<div class="property-location">📍 Location not specified</div>`;

  card.innerHTML = `
    <div class="property-card-image">${imageContent}</div>
    <div class="property-card-body">
      <h3>${escapeHtml(prop.title)}</h3>
      ${locationHtml}
    </div>
    <div class="property-card-footer">
      <span class="property-price">$${formatPrice(prop.price)}</span>
      <button class="fav-btn ${prop.isFavourite ? "active" : ""}"
              data-property-id="${prop.id}"
              title="${prop.isFavourite ? "Remove from favourites" : "Add to favourites"}"
              aria-label="${prop.isFavourite ? "Remove from favourites" : "Add to favourites"}">
        ${prop.isFavourite ? "❤️" : "🤍"}
      </button>
    </div>
  `;

  const favBtn = card.querySelector(".fav-btn");
  favBtn.addEventListener("click", () => toggleFavourite(prop.id, favBtn));

  return card;
}

function formatPrice(price) {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function renderFavourites() {
  const grid = dom.favouritesGrid;
  grid.innerHTML = "";

  if (state.favourites.length === 0) {
    dom.emptyFavourites.classList.remove("hidden");
    return;
  }
  dom.emptyFavourites.classList.add("hidden");

  state.favourites.forEach((fav, idx) => {
    const prop = { ...fav.property, isFavourite: true };
    const card = createPropertyCard(prop, idx);
    grid.appendChild(card);
  });
}

async function toggleFavourite(propertyId, btnEl) {
  btnEl.disabled = true;
  try {
    const result = await api(`/favourite/${propertyId}/favourite`, {
      method: "POST",
    });

    // Animate
    btnEl.classList.add("animate");
    setTimeout(() => btnEl.classList.remove("animate"), 600);

    if (result.isFavourite) {
      btnEl.classList.add("active");
      btnEl.innerHTML = "❤️";
      btnEl.title = "Remove from favourites";
      showToast("Added to favourites!", "success");
    } else {
      btnEl.classList.remove("active");
      btnEl.innerHTML = "🤍";
      btnEl.title = "Add to favourites";
      showToast("Removed from favourites", "info");
    }

    const propIdx = state.properties.findIndex((p) => p.id === propertyId);
    if (propIdx !== -1) {
      state.properties[propIdx].isFavourite = result.isFavourite;
    }

    const favourites = await api("/favourite");
    state.favourites = favourites;
    renderFavourites();
    updateStats();
  } catch (err) {
    showToast("Failed to update favourite: " + err.message, "error");
  } finally {
    btnEl.disabled = false;
  }
}

const tabs = $$(".section-tab");
const sections = {
  "all-properties": $("#section-all-properties"),
  "my-favourites": $("#section-my-favourites"),
  "add-property": $("#section-add-property"),
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    Object.values(sections).forEach((s) => s.classList.add("hidden"));
    sections[target].classList.remove("hidden");
  });
});

dom.addPropertyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = $("#prop-title").value.trim();
  const price = parseFloat($("#prop-price").value);
  const location = $("#prop-location").value.trim();
  const image_url = $("#prop-image").value.trim();

  if (!title || !price || price <= 0) {
    showToast("Title and a valid price are required", "error");
    return;
  }

  setLoading(dom.addPropertyBtn, true);
  try {
    const payload = { title, price };
    if (location) payload.location = location;
    if (image_url) payload.image_url = image_url;

    await api("/properties/add", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    showToast("Property added successfully!", "success");
    dom.addPropertyForm.reset();

    tabs[0].click();
    await loadDashboardData();
  } catch (err) {
    showToast("Failed to add property: " + err.message, "error");
  } finally {
    setLoading(dom.addPropertyBtn, false);
  }
});

(function init() {
  if (state.token && state.user) {
    showDashboard();
  } else {
    showAuth();
  }
})();

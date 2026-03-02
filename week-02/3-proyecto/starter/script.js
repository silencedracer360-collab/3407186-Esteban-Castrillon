// ============================================
// ESTADO GLOBAL
// ============================================
let items = []; // Todos los mensajes
let editingItemId = null; // ID del mensaje que se está editando

// ============================================
// CATEGORÍAS Y PRIORIDADES
// ============================================
const CATEGORIES = {
  traffic: { name: 'Tránsito', emoji: '🚦' },
  delivery: { name: 'Entrega', emoji: '📦' },
  emergency: { name: 'Emergencia', emoji: '🚨' },
  community: { name: 'Comunidad', emoji: '🏘️' },
};

const PRIORITIES = {
  high: { name: 'Alta', color: '#ef4444' },
  medium: { name: 'Media', color: '#f59e0b' },
  low: { name: 'Baja', color: '#22c55e' },
};

// ============================================
// PERSISTENCIA (LocalStorage)
// ============================================
const STORAGE_KEY = 'urbanMessages';

const loadItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');

const saveItems = (itemsToSave) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));

// ============================================
// CRUD
// ============================================
const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(),
    title: itemData.title ?? '',
    description: itemData.description ?? '',
    category: itemData.category ?? 'community',
    priority: itemData.priority ?? 'medium',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    ...itemData,
  };

  items = [...items, newItem];
  saveItems(items);
  return items;
};

const updateItem = (id, updates) => {
  items = items.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
  );
  saveItems(items);
  return items;
};

const deleteItem = (id) => {
  items = items.filter((item) => item.id !== id);
  saveItems(items);
  return items;
};

const toggleItemActive = (id) => {
  items = items.map((item) =>
    item.id === id ? { ...item, active: !item.active, updatedAt: new Date().toISOString() } : item
  );
  saveItems(items);
  return items;
};

const clearInactive = () => {
  items = items.filter((item) => item.active);
  saveItems(items);
  return items;
};

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================
const filterByStatus = (arr, status = 'all') =>
  status === 'all'
    ? arr
    : arr.filter((item) => (status === 'active' ? item.active : !item.active));

const filterByCategory = (arr, category = 'all') =>
  category === 'all' ? arr : arr.filter((item) => item.category === category);

const filterByPriority = (arr, priority = 'all') =>
  priority === 'all' ? arr : arr.filter((item) => item.priority === priority);

const searchItems = (arr, query = '') => {
  if (!query.trim()) return arr;
  const term = query.toLowerCase();
  return arr.filter(
    (item) =>
      item.title.toLowerCase().includes(term) ||
      (item.description ?? '').toLowerCase().includes(term)
  );
};

const applyFilters = (arr, filters = {}) => {
  const { status = 'all', category = 'all', priority = 'all', search = '' } = filters;
  let result = filterByStatus(arr, status);
  result = filterByCategory(result, category);
  result = filterByPriority(result, priority);
  result = searchItems(result, search);
  return result;
};

// ============================================
// ESTADÍSTICAS
// ============================================
const getStats = (arr = []) => {
  const total = arr.length;
  const active = arr.filter((item) => item.active).length;
  const inactive = total - active;

  const byCategory = arr.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  const byPriority = arr.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, byCategory, byPriority };
};

// ============================================
// RENDERIZADO
// ============================================
const getCategoryEmoji = (category) => CATEGORIES[category]?.emoji ?? '📌';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

const renderItem = (item) => {
  const { id, title, description, category, priority, active, createdAt } = item;
  return `
    <div class="item ${active ? '' : 'inactive'} priority-${priority}" data-item-id="${id}">
      <input type="checkbox" class="item-checkbox" ${active ? 'checked' : ''}>
      <div class="item-content">
        <h3 class="item-title">${title}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <div class="item-meta">
          <span class="badge badge-category">${getCategoryEmoji(category)} ${CATEGORIES[category]?.name}</span>
          <span class="badge badge-priority priority-${priority}">${PRIORITIES[priority]?.name}</span>
          <span class="item-date">📅 ${formatDate(createdAt)}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" title="Editar">✏️</button>
        <button class="btn-delete" title="Eliminar">🗑️</button>
      </div>
    </div>
  `;
};

const renderItems = (arr) => {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = arr.map(renderItem).join('') || `<p>No hay mensajes aún</p>`;
};

const renderStatsDOM = () => {
  const stats = getStats(items);
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;
};

// ============================================
// EVENT HANDLERS
// ============================================
const handleFormSubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category = document.getElementById('item-category').value;
  const priority = document.getElementById('item-priority').value;

  if (!title) return alert('El título es obligatorio');

  const itemData = { title, description, category, priority };

  if (editingItemId) {
    items = updateItem(editingItemId, itemData);
  } else {
    items = createItem(itemData);
  }

  resetForm();
  renderItems(items);
  renderStatsDOM();
};

const handleItemToggle = (id) => {
  items = toggleItemActive(id);
  renderItems(items);
  renderStatsDOM();
};

const handleItemEdit = (id) => {
  const item = items.find((i) => i.id === id);
  if (!item) return;

  document.getElementById('item-name').value = item.title;
  document.getElementById('item-description').value = item.description ?? '';
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-priority').value = item.priority;

  editingItemId = id;
  document.getElementById('form-title').textContent = '✏️ Editar Mensaje';
  document.getElementById('submit-btn').textContent = 'Actualizar';
  document.getElementById('cancel-btn').style.display = 'inline-block';
};

const handleItemDelete = (id) => {
  if (!confirm('¿Eliminar este mensaje?')) return;
  items = deleteItem(id);
  renderItems(items);
  renderStatsDOM();
};

const resetForm = () => {
  document.getElementById('item-form').reset();
  document.getElementById('form-title').textContent = '➕ Nuevo Mensaje';
  document.getElementById('submit-btn').textContent = 'Crear';
  document.getElementById('cancel-btn').style.display = 'none';
  editingItemId = null;
};

// ============================================
// EVENT LISTENERS
// ============================================
const attachEventListeners = () => {
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);

  document.getElementById('item-list').addEventListener('click', (e) => {
    const itemEl = e.target.closest('.item');
    if (!itemEl) return;
    const id = parseInt(itemEl.dataset.itemId);

    if (e.target.classList.contains('item-checkbox')) handleItemToggle(id);
    else if (e.target.classList.contains('btn-edit')) handleItemEdit(id);
    else if (e.target.classList.contains('btn-delete')) handleItemDelete(id);
  });
};

// ============================================
// INICIALIZACIÓN
// ============================================
const init = () => {
  items = loadItems();
  renderItems(items);
  renderStatsDOM();
  attachEventListeners();
  console.log('✅ Aplicación inicializada');
};

document.addEventListener('DOMContentLoaded', init);
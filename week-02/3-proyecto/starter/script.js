// ===============================
// VARIABLES
// ===============================
const form = document.querySelector('#item-form');
const list = document.querySelector('#item-list');

// ===============================
// CATEGORÍAS (DOMINIO: MENSAJERÍA URBANA)
// ===============================
const CATEGORIES = {
  traffic: '🚦 Tránsito',
  delivery: '📦 Entrega',
  emergency: '🚨 Emergencia',
  community: '🏘️ Comunidad'
};

// ===============================
// FUNCIÓN PARA CREAR MENSAJE
// ===============================
const createMessage = ({ title, description, category, priority }) => {
  const li = document.createElement('li');
  li.classList.add('message');

  // Contenido del mensaje
  li.innerHTML = `
    <h3>${title}</h3>
    <p>${description || 'Sin descripción'}</p>
    <small>
      ${CATEGORIES[category]} | Urgencia: ${priority.toUpperCase()}
    </small>
  `;

  // -------------------------------
  // BOTÓN ELIMINAR
  // -------------------------------
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌ Eliminar';
  deleteBtn.classList.add('delete-btn');

  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(deleteBtn);

  return li;
};

// ===============================
// EVENTO SUBMIT DEL FORMULARIO
// ===============================
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Destructuring de los datos del formulario
  const messageData = {
    title: document.querySelector('#item-name').value,
    description: document.querySelector('#item-description').value,
    category: document.querySelector('#item-category').value,
    priority: document.querySelector('#item-priority').value
  };

  const messageElement = createMessage(messageData);
  list.appendChild(messageElement);

  form.reset();
});
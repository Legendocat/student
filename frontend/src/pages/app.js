import {
  register,
  login,
  logout,
  getProfile,
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
  addComment,
} from '../api/api.js';

const authStatus = document.getElementById('authStatus');
const profileBox = document.getElementById('profileBox');
const itemsList = document.getElementById('itemsList');

function setStatus(text) {
  authStatus.textContent = text;
}

function getAuthPayload() {
  return {
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim(),
  };
}

async function loadItems(search = '') {
  const data = await getItems(search);
  const items = data.items || [];

  itemsList.innerHTML = items.map((item) => `
    <article class="item-card">
      <h3>${item.title}</h3>
      <p>${item.content || ''}</p>
      <div class="meta">Автор: ${item.username} | Теги: ${(item.tags || []).join(', ') || '—'}</div>
      <div class="meta">Лайки: ${item.likesCount} | Комментарии: ${item.commentsCount}</div>
      <div class="button-row left">
        <button data-like="${item.id}">Лайк</button>
        <button data-unlike="${item.id}">Убрать лайк</button>
        <button data-delete="${item.id}">Удалить</button>
      </div>
      <div class="comment-box">
        <input id="comment-${item.id}" placeholder="Комментарий" />
        <button data-comment="${item.id}">Добавить комментарий</button>
      </div>
    </article>
  `).join('');
}

document.getElementById('registerBtn').addEventListener('click', async () => {
  const payload = getAuthPayload();
  const data = await register(payload);
  setStatus(data.message || `Пользователь ${data.user?.username || ''} зарегистрирован`);
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const payload = getAuthPayload();
  const data = await login(payload);
  if (data.token) {
    localStorage.setItem('token', data.token);
    setStatus(`Выполнен вход: ${data.user.username}`);
  } else {
    setStatus(data.message || 'Ошибка входа');
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await logout();
  localStorage.removeItem('token');
  setStatus('Не авторизован');
});

document.getElementById('profileBtn').addEventListener('click', async () => {
  const data = await getProfile();
  profileBox.classList.remove('hidden');
  profileBox.innerHTML = `<strong>Профиль:</strong> ${data.username || ''} (${data.email || data.message})`;
});

document.getElementById('createItemBtn').addEventListener('click', async () => {
  const title = document.getElementById('itemTitle').value.trim();
  const content = document.getElementById('itemContent').value.trim();
  const tags = document.getElementById('itemTags').value.split(',').map((t) => t.trim()).filter(Boolean);
  const data = await createItem({ title, content, tags });
  setStatus(data.message || `Создана запись: ${data.title}`);
  await loadItems();
});

document.getElementById('searchBtn').addEventListener('click', async () => {
  const value = document.getElementById('searchInput').value.trim();
  await loadItems(value);
});

itemsList.addEventListener('click', async (event) => {
  const likeId = event.target.dataset.like;
  const unlikeId = event.target.dataset.unlike;
  const deleteId = event.target.dataset.delete;
  const commentId = event.target.dataset.comment;

  if (likeId) {
    await likeItem(likeId);
    await loadItems();
  }

  if (unlikeId) {
    await unlikeItem(unlikeId);
    await loadItems();
  }

  if (deleteId) {
    await deleteItem(deleteId);
    await loadItems();
  }

  if (commentId) {
    const content = document.getElementById(`comment-${commentId}`).value.trim();
    await addComment(commentId, content);
    await loadItems();
  }
});

loadItems();

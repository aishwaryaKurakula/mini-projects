const button = document.getElementById('add-btn');
const inputBox = document.getElementById('input-text');
const taskList = document.getElementById('task-list');
const empty = document.getElementById('empty');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');

button.addEventListener('click', createTask);
inputBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    createTask();
  }
});

document.addEventListener('DOMContentLoaded', showTask);

defaultTaskData();

function defaultTaskData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }
}

function createTask() {
  const text = inputBox.value.trim();
  if (!text) {
    alert('Please enter a task');
    inputBox.focus();
    return;
  }

  const task = {
    id: Date.now().toString(),
    text,
    done: false,
  };

  appendTask(task);
  updateInfo();
  saveData();
  inputBox.value = '';
  inputBox.focus();
}

function appendTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.className = task.done ? 'checked' : '';
  li.innerHTML = `
    <span class="task-text"></span>
    <button class="delete-btn" aria-label="Delete task">&times;</button>
  `;

  li.querySelector('.task-text').textContent = task.text;
  taskList.appendChild(li);
}

taskList.addEventListener('click', (event) => {
  const clickedLi = event.target.closest('li');
  if (!clickedLi) return;

  if (event.target.classList.contains('delete-btn')) {
    clickedLi.remove();
    updateInfo();
    saveData();
    return;
  }

  clickedLi.classList.toggle('checked');
  updateInfo();
  saveData();
});

function updateInfo() {
  const items = Array.from(taskList.children);
  const completed = items.filter((item) => item.classList.contains('checked')).length;

  empty.style.display = items.length === 0 ? 'block' : 'none';
  totalCount.textContent = items.length;
  completedCount.textContent = completed;
}

function saveData() {
  const tasks = Array.from(taskList.children).map((li) => ({
    id: li.dataset.id,
    text: li.querySelector('.task-text').textContent,
    done: li.classList.contains('checked'),
  }));

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showTask() {
  const saved = localStorage.getItem('tasks');
  let tasks = [];

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      tasks = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      tasks = [];
    }
  }

  taskList.innerHTML = '';
  tasks.forEach(appendTask);
  updateInfo();
}

// Data structure: { lists: [{ name, id, tasks: [{ id, title, desc, date, time, completed }] }], selectedListId }
const listsKey = 'todo-lists';
const selectedListKey = 'selected-list-id';
let lists = JSON.parse(localStorage.getItem(listsKey)) || [];
let selectedListId = localStorage.getItem(selectedListKey) || null;

const listsContainer = document.getElementById('lists');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const newListName = document.getElementById('new-list-name');
const addListBtn = document.getElementById('add-list-btn');

function save() {
  localStorage.setItem(listsKey, JSON.stringify(lists));
  localStorage.setItem(selectedListKey, selectedListId);
}

function renderLists() {
  listsContainer.innerHTML = '';
  lists.forEach(list => {
    const div = document.createElement('div');
    div.className = 'list-item' + (list.id === selectedListId ? ' active' : '');
    div.textContent = list.name;
    div.onclick = () => {
      selectedListId = list.id;
      save();
      render();
    };
    listsContainer.appendChild(div);
  });
}

function renderTasks() {
  taskList.innerHTML = '';
  const list = lists.find(l => l.id === selectedListId);
  if (!list) return;
  list.tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    const details = document.createElement('div');
    details.className = 'task-details';
    details.innerHTML = `<strong>${task.title}</strong><br>${task.desc ? task.desc + '<br>' : ''}${task.date ? '📅 ' + task.date : ''} ${task.time ? '⏰ ' + task.time : ''}`;
    li.appendChild(details);
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      save();
      render();
    };
    actions.appendChild(completeBtn);
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      taskTitle.value = task.title;
      taskDesc.value = task.desc;
      taskDate.value = task.date;
      taskTime.value = task.time;
      taskForm.onsubmit = function(e) {
        e.preventDefault();
        task.title = taskTitle.value;
        task.desc = taskDesc.value;
        task.date = taskDate.value;
        task.time = taskTime.value;
        save();
        render();
        taskForm.reset();
        taskForm.onsubmit = defaultTaskSubmit;
      };
    };
    actions.appendChild(editBtn);
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      list.tasks = list.tasks.filter(t => t.id !== task.id);
      save();
      render();
    };
    actions.appendChild(delBtn);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function render() {
  renderLists();
  renderTasks();
}

addListBtn.onclick = () => {
  const name = newListName.value.trim();
  if (!name) return;
  const id = Date.now().toString();
  lists.push({ name, id, tasks: [] });
  selectedListId = id;
  newListName.value = '';
  save();
  render();
};

function defaultTaskSubmit(e) {
  e.preventDefault();
  const list = lists.find(l => l.id === selectedListId);
  if (!list) return;
  const title = taskTitle.value.trim();
  if (!title) return;
  list.tasks.push({
    id: Date.now().toString(),
    title,
    desc: taskDesc.value,
    date: taskDate.value,
    time: taskTime.value,
    completed: false
  });
  save();
  render();
  taskForm.reset();
}
taskForm.onsubmit = defaultTaskSubmit;

// Initial render
render();

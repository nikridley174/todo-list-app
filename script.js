const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filters button');
const themeToggle = document.getElementById('theme-toggle');

let currentFilter = 'all';
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);   // Fixed typo: data-them → data-theme
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;   // Fixed template literal

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn" aria-label="Delete task">×</button>
        `;

        // Checkbox toggle
        li.querySelector('input').addEventListener('change', () => {
            tasks[index].completed = !tasks[index].completed;
            saveAndRender();
        });

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            saveAndRender();
        });

        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Update task count
function updateTaskCount() {
    const activeCount = tasks.filter(t => !t.completed).length;   // Fixed: lenth → length
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;   // Fixed template literal
}

// Save and re-render
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = '';
    saveAndRender();
}

// Filter handling
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Event listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
});

// Initial render
renderTasks();

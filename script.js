document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() !== '') {
        const taskText = taskInput.value.trim();
        const taskItem = document.createElement('li');
        taskItem.setAttribute('data-task', Date.now()); // Unique identifier for each task
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button onclick="removeTask(this)">Remove</button>
            <button onclick="completeTask(this)">Complete</button>
            <button onclick="editDueDate(this)">Due Date</button>
            <span class="due-date"></span>
            <select onchange="setPriority(this)">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <span class="priority"></span>
        `;
        taskList.appendChild(taskItem);

        saveTask(taskText, taskItem.getAttribute('data-task'), taskItem.querySelector('select').value);
        taskInput.value = '';
    }
}

function removeTask(button) {
    const taskList = document.getElementById('taskList');
    const taskItem = button.parentNode;
    taskList.removeChild(taskItem);

    // Update local storage after removing the task
    updateLocalStorage();
}

function completeTask(button) {
    const taskList = document.getElementById('taskList');
    const taskItem = button.parentNode;
    taskItem.classList.toggle('completed');

    // Update local storage after completing the task
    updateLocalStorage();
}

function editDueDate(button) {
    const modal = document.getElementById('modal');
    const taskItem = button.parentNode;
    const dueDate = taskItem.querySelector('.due-date').innerText.split(' ')[2];

    modal.setAttribute('data-task', taskItem.getAttribute('data-task'));
    document.getElementById('dueDate').value = dueDate;
    openModal();
}

function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addDueDate() {
    const dueDate = document.getElementById('dueDate').value;
    const modal = document.getElementById('modal');
    const taskList = document.getElementById('taskList');
    const activeTask = modal.getAttribute('data-task');

    const taskItem = taskList.querySelector(`li[data-task="${activeTask}"]`);
    const dueDateSpan = taskItem.querySelector('.due-date');

    if (dueDate.trim() !== '') {
        dueDateSpan.innerText = `Due Date: ${dueDate}`;
        closeModal();
        updateLocalStorage();
    }
}

function setPriority(select) {
    const taskList = document.getElementById('taskList');
    const taskItem = select.parentNode;
    const priority = select.value;
    const prioritySpan = taskItem.querySelector('.priority');

    prioritySpan.innerText = `Priority: ${priority}`;

    // Update local storage after setting priority
    updateLocalStorage();
}

function saveTask(task, taskId, priority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task, id: taskId, dueDate: '', priority });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.setAttribute('data-task', task.id);
        taskItem.classList.toggle('completed', task.completed);
        taskItem.innerHTML = `
            <span>${task.task}</span>
            <button onclick="removeTask(this)">Remove</button>
            <button onclick="completeTask(this)">Complete</button>
            <button onclick="editDueDate(this)">Due Date</button>
            <span class="due-date">${task.dueDate}</span>
            <select onchange="setPriority(this)">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <span class="priority">${task.priority}</span>
        `;
        taskList.appendChild(taskItem);
    });
}

function updateLocalStorage() {
    const taskList = document.getElementById('taskList');
    let tasks = [];

    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskId = taskItem.getAttribute('data-task  ');
        const taskText = taskItem.querySelector('span ').innerText;
        const dueDate = taskItem.querySelector('.due-date ').innerText.split(' ')[2];
        const priority = taskItem.querySelector('.priority ').innerText.split(' ')[1];

        tasks.push({ task: taskText, id: taskId, dueDate, priority });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

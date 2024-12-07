const form = document.getElementById('task-form');
const pendingTasksContainer = document.getElementById('pending-tasks');
const completedTasksContainer = document.getElementById('completed-tasks');

let isEditing = false;
let currentTask = null;
document.addEventListener('DOMContentLoaded', loadTasks);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    if (isEditing && currentTask) {
        updateTaskElement(currentTask, title, description, dueDate, priority);
        isEditing = false;
        currentTask = null;
    } else {
        const task = createTaskElement(title, description, dueDate, priority);
        pendingTasksContainer.appendChild(task);
    }

    saveTasks();
    form.reset();
});

function createTaskElement(title, description, dueDate, priority) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    taskDiv.innerHTML = `
        <h3 class="title"> ${title}</h3>
        <div class="task-para">
        <p class="description"> ${description}</p>
        <p class="dueData"><strong>Due Date: </strong>${dueDate}</p>
        <p class="priority"><strong>Priority: </strong>${priority}</p></div>
        <div class="btn-cls">
        <a href="#task-form" class="edit">
    <button>Edit</button>
</a>

        <button class="delete">Delete</button>
        <button class="complete">Mark as Completed</button></div>
    `;

    taskDiv.querySelector('.edit').addEventListener('click', () => {
        enterEditMode(taskDiv, title, description, dueDate, priority);
        console.log("edit clicked");
        
    });

    taskDiv.querySelector('.delete').addEventListener('click', () => {
        taskDiv.remove();
        saveTasks();
    });

    taskDiv.querySelector('.complete').addEventListener('click', () => {
        taskDiv.classList.add('complete-task');
        completedTasksContainer.appendChild(taskDiv);

        taskDiv.querySelector('.complete').remove();
        saveTasks();
    });

    return taskDiv;
}

function enterEditMode(taskDiv) {
    const title = taskDiv.querySelector('.title').textContent;
    console.log(title);
    
    const description = taskDiv.querySelector('.description').textContent;
    console.log(description);
    const dueDate = taskDiv.querySelector('.dueData').textContent.replace('Due Date: ', '');
    console.log(dueDate);
    const priority = taskDiv.querySelector('.priority').textContent.replace('Priority: ', '');
    console.log(priority);

    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('due-date').value = dueDate;
    document.getElementById('priority').value = priority;

    isEditing = true;
    currentTask = taskDiv;
}

function updateTaskElement(taskDiv, title, description, dueDate, priority) {
    taskDiv.querySelector('.title').textContent = title;
    taskDiv.querySelector('.description').textContent = description;
    taskDiv.querySelector('.dueData').textContent = `Due Date: ${dueDate}`;
    taskDiv.querySelector('.priority').textContent = `Priority: ${priority}`;

    saveTasks();
}

document.getElementById('filter-btn').addEventListener('click',applyfilter)

function applyfilter(){
    const filterValue = document.getElementById('priority-filter').value ;
    // console.log(filterValue);
    
    const filterStatus = document.getElementById('status-filter').value;
    // console.log(filterStatus);
    
    const dateValue = document.getElementById('date-filter').value;
    // console.log(dateFilter);
    
    let noData = false;
    // console.log(filterValue); 

    pendingTasksContainer.querySelectorAll('.task').forEach(task =>{
        const displayTask = priorityFilter(task,filterValue) && statusFilter(task,filterStatus) &&
        dateFilter(task, dateValue);


        console.log(displayTask);
        if(displayTask){
            task.style.display = 'block';
            noData = true;
        }else{
            task.style.display = 'none'
        }
    })

    const noDataToShow = document.getElementById('no-data');
    if(noData){
        noDataToShow.style.display = 'none';
    }else{
        noDataToShow.style.display = 'block';
    }
    completedTasksContainer.querySelectorAll('.task').forEach(task => {
        const displayTask = priorityFilter(task,filterValue) && statusFilter(task,filterStatus) &&
        dateFilter(task, dateValue);


        task.style.display = displayTask ? 'block' : 'none';
    })
    document.getElementById('priority-filter').value = 'all';
    document.getElementById('status-filter').value = 'all';
    document.getElementById('date-filter').value = 'all';
}

function priorityFilter(task,priorityValue){
    if (priorityValue === 'all') return true;
    const taskPriority = task.querySelector('.priority').textContent.replace("Priority: ", '');
    return taskPriority === priorityValue;

}

function statusFilter(task,statusValue){
    if(statusValue === 'all') return task;
    const taskStatus = task.closest('#pending-tasks')? 'pending' : 'completed';
    return statusValue === taskStatus
}

function dateFilter(task, dateValue) {
    const taskDueDate = new Date(task.querySelector('.dueData').textContent.replace('Due Date: ', ''));
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    if (dateValue === 'all') return true;
    if (dateValue === 'next-7-days') {
        return taskDueDate >= today && taskDueDate <= next7Days;
    }
    return false;
}

function saveTasks() {
    const tasks = [];
    pendingTasksContainer.querySelectorAll('.task').forEach(task => {
        tasks.push({
            title: task.querySelector('.title').textContent,
            description: task.querySelector('.description').textContent,
            dueDate: task.querySelector('.dueData').textContent.replace('Due Date: ', ''),
            priority: task.querySelector('.priority').textContent.replace('Priority: ', ''),
            status: 'pending'
        });
    });
    completedTasksContainer.querySelectorAll('.task').forEach(task => {
        tasks.push({
            title: task.querySelector('.title').textContent,
            description: task.querySelector('.description').textContent,
            dueDate: task.querySelector('.dueData').textContent.replace('Due Date: ', ''),
            priority: task.querySelector('.priority').textContent.replace('Priority: ', ''),
            status: 'completed'
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        const taskElement = createTaskElement(task.title, task.description, task.dueDate, task.priority);
        
        if (task.status === 'completed') {
            completedTasksContainer.appendChild(taskElement);
            taskElement.querySelector('.complete').remove(); // Complete button remove karna
        } else {
            pendingTasksContainer.appendChild(taskElement);
        }
    });
}

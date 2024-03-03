// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        // Send task data to backend
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to add task');
        })
        .then(task => {
            renderTask(task);
            taskInput.value = '';
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
    }
}

// Function to render tasks
function renderTask(task) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.appendChild(document.createTextNode(task.text));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm float-right';
    deleteBtn.appendChild(document.createTextNode('Delete'));
    deleteBtn.addEventListener('click', () => deleteTask(task._id));

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to delete a task
function deleteTask(taskId) {
    // Send task ID to backend for deletion
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove task from UI
            const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
            if (taskItem) {
                taskItem.remove();
            }
            return;
        }
        throw new Error('Failed to delete task');
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// Function to fetch tasks from backend and render them on page load
document.addEventListener('DOMContentLoaded', () => {
    fetch('/tasks')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(tasks => {
        tasks.forEach(task => renderTask(task));
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
});

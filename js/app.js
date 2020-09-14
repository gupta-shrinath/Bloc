function changeTaskStatus(id) {
    console.log(id);
    let checkbox = document.getElementById(id);
    let textId = id.replace('-checkbox', '');
    console.log(checkbox.checked);
    let text = document.getElementById(textId);
    if (checkbox.checked == true) {
        console.log('asda');
        text.classList.add("task-done");
    } else {
        text.classList.remove("task-done");
    }
}

function addTask() {
    let list = document.getElementById('list');
    let item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-center');
    item.id = 'item-2';
    let task = document.createTextNode('task-2');
    var checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "item-2-checkbox");
    checkbox.checked = false;
    list.appendChild(item);
    item.appendChild(task);
    item.appendChild(checkbox);
    checkbox.onclick = function () { changeTaskStatus(checkbox.id); };
}

function removeTask(id) {
    console.log("started");
    let hashId = '#' + id;
    console.log(hashId);
    $(hashId).remove();
    updateTasksCount();
}

function updateTasksCount() {
    let list = document.getElementById('list');
    let taskCount = list.childElementCount;
    let count = document.getElementById('taskCount');
    count.innerText = taskCount + " Task";
}

$(document).ready(function () {
    updateTasksCount();
});
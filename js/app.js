$(document).ready(createTaskList());

// Auto focus on input of add task modal //
$('#add-task-container').on('shown.bs.modal', function () {
    $('#new-task').trigger('focus');
});

/** 
 * createTaskList() set the contract object and gets the number 
 * of tasks of the user and then calls addTaskToList() to add 
 * them to HTML one after the other after all task are added to
 * HTML then calls updateTaskCount()
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
*/
async function createTaskList() {
    // Get account from the Ganache EVM //
    try {
        await getAccount();
        // Set contract and set gas //
        contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            numberOfTask = await contract.methods.getTaskCount().call({ from: web3.eth.defaultAccount });
            /*  The actual number of task may differ because
                when an task is removed the task element is 
                removed and the index value now has nothing.
            */
            console.log('Number of Tasks are ' + numberOfTask);
            // If there are task present //
            if (numberOfTask != 0) {
                // Fetch one task after the other until no task remain // 
                console.log('Start fetching task ...');
                let taskIterator = 0;
                while (taskIterator < numberOfTask) {
                    try {
                        let task = await contract.methods.getTask(taskIterator).call({ from: web3.eth.defaultAccount });
                        if (task[0] != '') {
                            // addTaskToList add this task as children to the ul tag //
                            addTaskToList(taskIterator, task[0], task[1]);
                        }
                        else {
                            console.log('The index ' + taskIterator + ' is empty');
                        }
                    } catch {
                        console.log('Failed to get Task ' + taskIterator);
                    }
                    taskIterator++;
                }
                // Update the task count in HTML //
                updateTasksCount();
            }
        } catch {
            console.log('Failed to get task count from blockchain');
        }
    } catch {
        console.log('Failed to get the acount');
    }

}

/**
 * addTaskToList() takes the task atributes and adds them to 
 * the HTML
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
 * @param {number} id 
 * @param {string} name 
 * @param {boolean} status 
 */
function addTaskToList(id, name, status) {
    console.log('addTaskToList(): Add Task ' + (id) + ' ' + [name, status]);
    /*  Get the id of ul element so to be able to 
        add children to it 
    */
    let list = document.getElementById('list');
    /*  Create a li element and add the class 
        required to make look good  and 
        set the id of it 
    */
    let item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-center');
    item.id = 'item-' + id;
    // Create a text to add it to the li element//
    let task = document.createTextNode(name);
    /*  Create a checkbox and set its id and checked 
        value to add it to the li element 
    */
    var checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "item-" + id + "-checkbox");
    checkbox.checked = status;
    /*  if status is true then add task-done class to li
        element so that the text gets a linethrough 
    */
    if (status) {
        item.classList.add("task-done");
    }
    // Add the li element to ul element //
    list.appendChild(item);
    /* Set a ondblclick event to able to remove the
       item when double clicked on it */
    item.ondblclick = function () {
        removeTask(item.id);
    }
    // Append the text of task //
    item.appendChild(task);
    // Append the checkbox for task //
    item.appendChild(checkbox);
    // Add onclick to the checkbox // 
    checkbox.onclick = function () { changeTaskStatus(checkbox.id, id); };
}

/**
 * removeTask() remove the task from blockchain and then from 
 * the HTML using JQuery
 * Note: The taskIndex is the li element id {item-taskIndex}
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
 * @param {string} taskIndex 
 */
async function removeTask(taskIndex) {
    console.log("removeTask(): Remove Task " + taskIndex);
    // Create the selector for the Task //
    let taskSelector = '#' + taskIndex;
    // Make taskIndex to have only task index number
    taskIndex = taskIndex.replace('item-', '');
    try {
        await contract.methods.deleteTask(taskIndex).send({ from: web3.eth.defaultAccount });
        console.log('Remove Task ' + taskIndex + ' from the blockchain');
        // Remove the task from the HTML //
        $(taskSelector).remove();
        // Update the task count in HTML//
        updateTasksCount();
    } catch {
        console.log('Issue occured while removing task item-' + taskIndex);
    }
}

/**
 * changeTaskStatus() change the status of task in blockchain and 
 * then in the HTML
 * Note: The id is the checkbox id {item-taskIndex-checkbox}
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
 * @param {string} id 
 * @param {number} taskIndex 
 */
async function changeTaskStatus(id, taskIndex) {
    // Get checkbox element //
    let checkbox = document.getElementById(id);
    // Get the id of the li element //
    let textId = id.replace('-checkbox', '');
    // Get the li element //
    let text = document.getElementById(textId);
    try {
        await contract.methods.updateStatus(taskIndex, checkbox.checked).send({ from: web3.eth.defaultAccount });
        console.log('changeTaskStatus(): Change status of task ' + textId + ' to ' + checkbox.checked);
        if (checkbox.checked) {
            text.classList.add("task-done");
        } else {
            text.classList.remove("task-done");
        }
    } catch (error) {
        console.log('Failed to change Status of task ' + textId + ' in blockchain');
    }
}

/**
 * updateTaskCount() update the number of task in HTML by counting 
 * the number of item in the ul element 
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
 */
function updateTasksCount() {
    // Get the element of ul tag //
    let list = document.getElementById('list');
    // Get the count of the ul element //
    let taskCount = list.childElementCount;
    console.log('updateTaskCount(): The number of task are ' + taskCount);
    // Set the count to the taskCount id element //
    let count = document.getElementById('taskCount');
    count.innerText = taskCount + " Task";
}

/**
 * addTask() add the task to the HTML via adddTasktoList() and then 
 * add it to blockchain and update the count via updateTaskCount() 
 * @author Gupta Shrinath <https://github.com/gupta-shrinath>
 * @param {string} name 
 */
async function addTask(name) {
    // Get the form element containing the new task //
    let form = document.getElementById('add-task-form');
    // Check if the input is valid and then add it//
    if (form.checkValidity()) {
        console.log('Get the number of task from blockchain');
        // Set blank value for text in the addtask modal //
        document.getElementById('new-task').value = '';
        // Remove the mentioned class because it might be 
        // present if a task was added before
        form.classList.remove('was-validated');
        // Get the number of task from blockchain // 
        contract.methods.getTaskCount().call({ from: web3.eth.defaultAccount }).then(numberOfTask => {
            // Add the task to the HTML //
            addTaskToList(numberOfTask, name, false);
            // Update the task count in HTML//
            updateTasksCount();
        }, err => {
            console.log('Failed to get the number of task in blockchain ' + err);
        });
        try {
            await contract.methods.addTask(name).send({ from: web3.eth.defaultAccount });
            console.log('Add task ' + name + ' to blockchain');
        } catch {
            console.log('Failed to add task to EVM');
        }

    } else {
        form.addEventListener('submit', function (event) {
            // Stop all events //
            event.preventDefault();
            event.stopPropagation();
            // Add the mentioned class to able to display
            // error to user
            form.classList.add('was-validated');
            // Set blank value for text in the addtask modal //
            document.getElementById('new-task').value = '';
        }, false);

    }

}


$(document).ready(createTaskList());

async function createTaskList() {
    // Get account from the Ganache EVM //
    try {
        await getAccount();
        // Set contract and set gas //
        contract = new web3.eth.Contract(contractABI, contractAddress);
        contract.options.gas = 10000000000;
        try {
            let isUserCreated = await contract.methods.isUserCreated(web3.eth.defaultAccount).call({ from: web3.eth.defaultAccount });
            if (isUserCreated) {
                // Check if user exists and fetch the number of task they have //
                console.log(web3.eth.defaultAccount + ' is a Bloc User');
                try {
                    numberOfTask = await contract.methods.getTaskCount(web3.eth.defaultAccount).call({ from: web3.eth.defaultAccount });
                    /*  The actual number of task may differ because
                        when an task is removed the task element is 
                        removed not it's index.
                    */
                    console.log('Number of Tasks are ' + numberOfTask);
                    // If there are task present //
                    if (numberOfTask != 0) {
                        // Fetch one task after the other until no task remain // 
                        console.log('Start fetching task ...');
                        let taskIterator = 0;
                        while (taskIterator < numberOfTask) {
                            try {
                                let task = await contract.methods.getTask(web3.eth.defaultAccount, taskIterator).call({ from: web3.eth.defaultAccount });
                                if (task[0] != '') {
                                    // addTaskToList add this task as children to the ul tag //
                                    addTaskToList(taskIterator, task[0], task[1]);
                                    // update the number of task //
                                    updateTasksCount();
                                }
                            } catch { 
                                console.log('Failed to get Task ' + taskIterator);
                            }
                            taskIterator++;
                        }
                    }
                } catch {
                    console.log('Failed to get task count from blockchain');
                }
            } else {
                try {
                    console.log('Create account for ' + web3.eth.defaultAccount + ' in blockchain');
                    await contract.methods.createUser(web3.eth.defaultAccount).send({ from: web3.eth.defaultAccount });
                } catch {
                    console.log('Failed to create account for ' + web3.eth.defaultAccount + ' in blockchain');
                }
            }
        } catch {
            console.log('Failed to detect whether user was created');

        }
    } catch {
        console.log('Failed to get the acount');
    }
   
}

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
    checkbox.onclick = function () { changeTaskStatus(checkbox.id, web3.eth.defaultAccount, id); };
}

async function removeTask(id) {
    console.log("removeTask(): Remove Task " + id);
    // Create the selector for the Task //
    let taskSelector = '#' + id;
    id = id.replace('item-', '');
    try {
        console.log('Remove Task ' + id + ' from the blockchain');
        await contract.methods.deleteTask(web3.eth.defaultAccount, id).send({ from: web3.eth.defaultAccount });
        $(taskSelector).remove();
        updateTasksCount();
    } catch {
        console.log('Issue occured while removing task item-' + id);
    }
}

async function changeTaskStatus(id, account, taskIndex) {
    // Get checkbox element //
    let checkbox = document.getElementById(id);
    // Get the id of the li element //
    let textId = id.replace('-checkbox', '');
    // Get the li element //
    let text = document.getElementById(textId);
    console.log('changeTaskStatus(): Change status of task ' + textId + ' to ' + checkbox.checked);
    if (checkbox.checked == true) {
        try {
            console.log('Change Status of task ' + textId + ' in blockchain');
            await contract.methods.updateStatus(account, taskIndex, checkbox.checked).send({ from: account });
            text.classList.add("task-done");
        } catch {
            console.log('Failed to change Status of task ' + textId + ' in blockchain');
        }
    } else {
        try {
            console.log('Change Status of task ' + textId + ' in blockchain');
            await contract.methods.updateStatus(account, taskIndex, checkbox.checked).send({ from: account });
            text.classList.remove("task-done");
        } catch {
            console.log('Failed to change Status of task ' + textId + ' in blockchain');
        }
    }
}

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

/* addTaskToList method takes the task atributes 
   and adds them to the HTML
   addTask method takes the task name and adds it
   to the blockchain and HTML
*/
async function addTask(name) {
    // Set blank value for text in the addtask modal //
    document.getElementById('new-task').value = '';
    console.log('Get the number of task from blockchain');
    contract.methods.getTaskCount(web3.eth.defaultAccount).call({ from: web3.eth.defaultAccount }).then(numberOfTask => {
        addTaskToList(numberOfTask, name, false);
        updateTasksCount();
    }, err => {
        console.log('Failed to get the number of task in blockchain ' + err);
    });
    try {
        console.log('Add task to blockchain');
        await contract.methods.addTask(web3.eth.defaultAccount, name).send({ from: web3.eth.defaultAccount });
    } catch {
        console.log('Failed to add task to EVM');
    }
}


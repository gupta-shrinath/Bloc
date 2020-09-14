pragma solidity ^0.5.1;

contract Bloc {
    
    struct Task {
        string name;
        bool isDone;
    }

    struct User {
        address accountAddress;
        Task[] tasks;
    }
    
    mapping (address => User) private Users;
    
    uint256 public userCount = 0;
    
    function _createUser(address _account) private {
        userCount++;
        /* Users[_account] returns a pointor which needs to be 
        saved in storage data location to perform operation  */
        User storage user = Users[_account];
        user.accountAddress = _account;
    }
    
    function _getTask(address _account,uint256 _taskIndex) private view returns(Task memory) {
        User memory user = Users[_account];
        return user.tasks[_taskIndex];
    }
    
    function _addTask(address _account,string memory _task) private {
        User storage user = Users[_account];
        user.tasks.push(Task({
            name:_task,
            isDone:false
        }));
    }
    
    function _deleteTask(address _account,uint256 _taskIndex) private view {
        User memory user = Users[_account];
        delete user.tasks[_taskIndex];
    }
    
    function _updateStatus(address _account,uint256 _taskIndex,bool _status) private view {
         User memory user = Users[_account];
         user.tasks[_taskIndex].isDone = _status;
    }
    
    function _getTaskCount(address _account) private view returns(uint256) {
        User memory user = Users[_account];
        return user.tasks.length;
    }
    
}

 

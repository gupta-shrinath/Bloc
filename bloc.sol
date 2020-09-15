pragma solidity ^0.5.1;
/* To be able to return Task struct from getTask method*/
pragma experimental ABIEncoderV2;

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
    
    address[] private accountAddress;
    
    uint256 private userCount = 0;
    
    function createUser(address _account) external {
        userCount++;
        /* Users[_account] returns a pointor which needs to be 
        saved in storage data location to perform operation  */
        accountAddress.push(_account);
        User storage user = Users[_account];
        user.accountAddress = _account;
    }
    
     function getTask(address _account,uint256 _taskIndex) external view returns (Task memory) {
        User memory user = Users[_account];
        return user.tasks[_taskIndex];
    }
    
    function addTask(address _account,string calldata _task) external {
        User storage user = Users[_account];
        user.tasks.push(Task({
            name:_task,
            isDone:false
        }));
    }
    
    function deleteTask(address _account,uint256 _taskIndex) external view {
        User memory user = Users[_account];
        delete user.tasks[_taskIndex];
    }
    
    function updateStatus(address _account,uint256 _taskIndex,bool _status) external view {
         User memory user = Users[_account];
         user.tasks[_taskIndex].isDone = _status;
    }
    
    function getTaskCount(address _account) external view returns (uint256) {
        User memory user = Users[_account];
        return user.tasks.length;
    }
    
    function getUserCount() external view returns (uint256){
        return userCount;
    }

    function isUserCreated(address _account) external view returns (bool) {
        for(uint i=0;i<accountAddress.length;i++) {
            if(_account == accountAddress[i]) {
                return true;
            }
        }
        return false;
    }
}

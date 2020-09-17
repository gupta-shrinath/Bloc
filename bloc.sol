pragma solidity ^0.5.1;
/* To be able to return Task struct from getTask method*/
pragma experimental ABIEncoderV2;

contract Bloc {
    
    struct Task {
        string task;
        bool isDone;
    }

    mapping (address => Task[]) private Users;
    
    function getTask(uint _taskIndex) external view returns (Task memory) {
        Task storage task = Users[msg.sender][_taskIndex];
        return task;
    }
    
    function addTask(string calldata _task) external {
       Users[msg.sender].push(Task({
           task:_task,
           isDone:false
       }));
    }
    
    function deleteTask(uint256 _taskIndex) external  {
        delete Users[msg.sender][_taskIndex];
    }
    
    function updateStatus(uint256 _taskIndex,bool _status) external  {
         Users[msg.sender][_taskIndex].isDone = _status;
    }
    
    function getTaskCount() external view returns (uint256) {
        return Users[msg.sender].length;
    }
    
}

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract TodoListContract {
    uint taskCount = 0;
    
    struct Task{
        uint id;
        string taskContent;
        bool isCompleted;
    }

    mapping(uint => Task) public tasks;

    constructor () public  {
        addTask("First Task");
    }

    function addTask(string memory _task) public{
        tasks[taskCount] = Task(taskCount, _task, false);
        taskCount++;
    }

    function toggleTask(uint _id)public {
        Task memory tempTask = tasks[_id];
        tempTask.isCompleted = !tempTask.isCompleted;
        tasks[_id] = tempTask;
    }
    
    function getAllTask() external view returns (Task[] memory) {
        Task[] memory temp = new Task[](taskCount);
        for (uint i = 0; i < taskCount; i++){
            temp[i] = tasks[i];
        }
        return temp;
    }

}
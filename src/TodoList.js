import React, { useDeferredValue, useEffect, useState } from 'react'
import { ethers } from 'ethers';
import TodoList_abi from './truffle/build/contracts/TodoListContract.json'
import './TodoList.css'

const TodoList = () => {

    const contractAddress = "0xa149e3215e660e80Bd68B775DDc93CF688765b59";
    const abi = TodoList_abi.abi;

    const [connText, setConnText] = useState("Not Connected");
    const [task, setTask] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("Not Connected");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [todos, setTodos] = useState([]);

    const handleConnectButton = () => {
        if (window.ethereum) {
            window.ethereum.request({method : "eth_requestAccounts"})
            .then((request) => handAccountChange(request[0]))
            .catch((e) => setErrorMessage(e))
        }
        else{
            setErrorMessage("Please install metamask");
            console.log("Metamask is not found");
        }
    }

    const handAccountChange =  (request) => {
        setDefaultAccount(request);
        setConnText("Connected");
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);
        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
        setContract(tempContract);

        getAllTask(tempContract);
    }

    const handleOnChange = (e) => {
        setTask(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tx = contract.addTask(task);
        const reci = await tx;
        console.log(reci);
        console.log("Task Added Successfully");
        getAllTask(contract);
        setTask("");
    }

    const handleOnTickChange = (id) => {
        contract.toggleTask(id)
    }
    useEffect(() => {
      console.log("rendering")
      if (defaultAccount !== "Not Connected"){
        loadTask();
      }
    });

    const loadTask = () => {
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      let tempSigner = tempProvider.getSigner();
      let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
      getAllTask(tempContract);
    }

    const getAllTask = async (cont) => {
        const fields = await cont.getAllTask();
        console.log("get task");
        setTodos(fields);
    }


    return (
        <div className='container'>
        
        <div className='header'>
          <img src={require("./assets/to-do-list.png")} id="todoIcon"></img>
          <h1>Todo List</h1>
        </div>


        <div class="account-section">
            <p class="account-hash">Account : {defaultAccount.substring(0,20)}</p>
            <button class="btn" onClick={handleConnectButton}>{connText}</button>
        </div>    
        <form className="formInput">
          <input type="text" 
          placeholder='Enter the task...'
          className='inputField'
          value={task}
          onChange={handleOnChange}/>
          <button className='btn position-abolute' onClick={handleSubmit}>Add</button>
        </form>

        <div className='taskContainer'>
            {todos.map((t, index) => (

            <div className='taskList'>
              <div style={{display:'flex',alignItems:'center'}}>
                <input type='checkbox'  onChange={() => handleOnTickChange(t[0])} className='chkBx' checked={t[2]}/>
                <label>{t[1]}</label>
              </div>

              <div className='chkTile'>
                <img src={require("./assets/edit.png")} className='taskIcon' />
                <img src={require("./assets/delete.png")} className='taskIcon'/>
              </div>
            </div>))}
            
        </div>
    </div>
    )
}

export default TodoList;
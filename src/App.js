import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css'; 
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [greeting, setGreetingValue] = useState('');

  // request access to the user's MetaMask account, returns an array of accounts that is connected
  async function requestAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    console.log(accounts);
  }
  
  async function fetchGreeting() {
    //window.ethereum is injected into the website if metamask in installed
    if(typeof window.ethereum !== 'undefined'){

      //web3provider used for connecting to metamask
      //provider enables you to connect to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //instance of the Greeter contract
      //contract instance created using a provider can only read contents of the smart contract
      const readOnlyContract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

      try{
        const data = await readOnlyContract.greet();
        console.log("DATA: ", data); 
      } catch (err){
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting() {
    if(!greeting) return;

    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //Signer essentially gives access to the connected account and is used to sign on transactions
      const signer = provider.getSigner();

      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);

      //after this execution, the transaction is not mined yet, it was just sent to the network
      const transactionResponse = await contract.setGreeting(greeting);

      //we execute the wait method for the transaction to be mined
      const transactionReceipt = await transactionResponse.wait();
      console.log("Transaction receipt: ", transactionReceipt);
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;

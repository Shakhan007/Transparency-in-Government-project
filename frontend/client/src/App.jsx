import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ConstructionProject from "./contracts/ConstructionProject.json"; // Ensure ABI file is correct

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [releasedFunds, setReleasedFunds] = useState(0);
  const [receivedFunds, setReceivedFunds] = useState(0);
  const [milestone, setMilestone] = useState("");
  const [milestoneStatus, setMilestoneStatus] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ConstructionProject.networks[networkId];
      const instance = new web3.eth.Contract(
        ConstructionProject.abi,
        deployedNetwork && deployedNetwork.address
      );

      setContract(instance);

      // Fetch project status
      const status = await instance.methods.getProjectStatus().call();
      setTotalBudget(Web3.utils.fromWei(status[0], "ether"));
      setReleasedFunds(Web3.utils.fromWei(status[1], "ether"));
      setReceivedFunds(Web3.utils.fromWei(status[2], "ether"));
    };

    loadBlockchainData();
  }, []);

  const verifyMilestone = async () => {
    try {
        await contract.methods.verifyMilestone(milestone).send({ from: account });
        alert(`Milestone ${milestone} Verified!`);
        
        // Update UI with new status
        setMilestoneStatus(`Milestone ${milestone} verified.`);
    } catch (error) {
        alert("Error verifying milestone!");
        console.error(error);
    }
};



const releaseFunds = async () => {
  try {
      await contract.methods.releaseFunds(milestone).send({ from: account });
      alert(`Funds Released for Milestone ${milestone}!`);

      // Fetch updated project status after fund release
      const status = await contract.methods.getProjectStatus().call();
      setReleasedFunds(Web3.utils.fromWei(status[1], "ether"));
      setReceivedFunds(Web3.utils.fromWei(status[2], "ether"));
  } catch (error) {
      alert("Error releasing funds!");
      console.error(error);
  }
};



  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Blockchain-Based Transparency System</h2>
      <p><strong>Connected Account:</strong> {account}</p>

      <h3>Project Status</h3>
      <p><strong>Total Budget Allocated by Government:</strong> {totalBudget} ETH</p>
      <p><strong>Total Funds Released:</strong> {releasedFunds} ETH</p>
      <p><strong>Total Funds Received by Contractor:</strong> {receivedFunds} ETH</p>

      <h3>Milestone Verification & Fund Release</h3>
      <input
        type="number"
        placeholder="Enter Milestone ID"
        onChange={(e) => setMilestone(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <button onClick={verifyMilestone} style={{ padding: "10px", marginRight: "10px", background: "yellow" }}>
        Verify Milestone
      </button>
      <button onClick={releaseFunds} style={{ padding: "10px", background: "green", color: "white" }}>
        Release Funds
      </button>

      {milestoneStatus && <p><strong>Status:</strong> {milestoneStatus}</p>}
    </div>
  );
}

export default App;

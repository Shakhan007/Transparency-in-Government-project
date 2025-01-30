// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract ConstructionProject {
    address public government;
    address public contractor;
    address public auditor;
    uint public totalBudget;
    uint public releasedFunds = 0;
    uint public receivedFunds = 0;  // Track total funds received by contractor

    struct Milestone {
        uint amount;
        bool verified;
        bool fundsReleased;
    }

    mapping(uint => Milestone) public milestones;
    event MilestoneVerified(uint milestoneId);
    event FundsReleased(uint milestoneId, uint amount);

    constructor(address _contractor, address _auditor, uint _totalBudget) {
        government = msg.sender;
        contractor = _contractor;
        auditor = _auditor;
        totalBudget = _totalBudget;
    }

    function addMilestone(uint milestoneId, uint amount) public {
        require(msg.sender == government, "Only government can add milestones");
        require(amount <= totalBudget - releasedFunds, "Not enough funds available");
        milestones[milestoneId] = Milestone(amount, false, false);
    }

    function verifyMilestone(uint milestoneId) public {
        require(msg.sender == auditor, "Only auditor can verify");
        milestones[milestoneId].verified = true;
        emit MilestoneVerified(milestoneId);
    }

    function releaseFunds(uint milestoneId) public {
    require(msg.sender == government, "Only government can release funds");
    require(milestones[milestoneId].verified, "Milestone not verified");
    require(!milestones[milestoneId].fundsReleased, "Funds already released");

    payable(contractor).transfer(milestones[milestoneId].amount);
    releasedFunds += milestones[milestoneId].amount;
    receivedFunds += milestones[milestoneId].amount;  // Ensure funds received is updated
    milestones[milestoneId].fundsReleased = true;
    
    emit FundsReleased(milestoneId, milestones[milestoneId].amount);
}



    function getProjectStatus() public view returns (uint, uint, uint) {
        return (totalBudget, releasedFunds, receivedFunds);
    }

    receive() external payable {}
}

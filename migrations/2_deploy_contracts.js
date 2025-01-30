const ConstructionProject = artifacts.require("ConstructionProject");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ConstructionProject, accounts[1], accounts[2], web3.utils.toWei("100", "ether"));
};



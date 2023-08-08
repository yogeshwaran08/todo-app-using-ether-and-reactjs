const TodoListContract = artifacts.require("TodoListContract");

module.exports = function(deployer) {
  deployer.deploy(TodoListContract);
};

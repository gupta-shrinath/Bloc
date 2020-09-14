ethereum.autoRefreshOnNetworkChange = false;
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
getAccount();

async function getAccount() {
    const accounts= await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    console.log(web3.eth.defaultAccount);
    setAccount(web3.eth.defaultAccount);
}

function setAccount(account) {
    let accountAddressLabel = document.getElementById('account-address');
    accountAddressLabel.innerText = '( ' + account + ' )';
}

let response = (async () => { return await getAccount() })();
response.then(data => { setAccount(data); }, err => { console.log('Failed'); });
function setAccount(account) {
    let accountAddressLabel = document.getElementById('account-address');
    accountAddressLabel.innerText = '( ' + account + ' )';
}
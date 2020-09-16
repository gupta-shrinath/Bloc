# BLOC
<p align="left">
<img alt="Model Prototype" src="https://img.shields.io/badge/model-prototype-brightgreen?style=for-the-badge&labelColor=black&logo=github">
<img alt="License" src="https://img.shields.io/github/license/gupta-shrinath/Bloc?color=bright%20green&labelColor=black&logo=github&style=for-the-badge">
</p>

* Bloc is a to-do application that runs on your local ethereum blockchain.
* Bloc uses smart-contracts and web3 js to talk to your local ethereum blockchain.

## Dependencies
* Bootstrap 4.5.2
* Jquery 3.5.1
* Web3 1.2.11
* Solidity ^0.5.1
* Ganache 2.4.0.1317

## Install 
- Download [Ganache](https://www.trufflesuite.com/ganache) for local ethereum blockchain.
Click on Quickstart Ethereum and after that note the address labeled under RPC Server 
(should be something like this http://127.0.0.1:7545) and make sure to copy the same 
address in `js/getAccount.js` file line 1.
- Go to [Remix IDE](http://remix.ethereum.org/) click on the plus icon in the file explorers
located in the left panel and name the file as bloc.sol (Make sure to sure http site not https).
    - Copy the code present in bloc.sol from this repo.
    - Go to solidity compiler located in the left panel and click on compile bloc.sol.
      down you'll find a button with copy icon and text as ABI click on it.Paste it in 
      `js/config.js` line 1<br>
      >var contractABI = `COPIED TEXT`;<br>
      The copied text will be enclosed in [].
    - Go to deploy and run transaction under environment select Web3 Provider. 
    - Enter the address you copied from Ganache and paste it click on OK.
    - Now a deploy button will be visible click on it. 
    - Down you'll find Deployed Contracts label now there will a copy icon button click on it   
      and paste in `js/config.js` line 2
      >var contractAddress = '`COPIED text`';<br>
      The copied text might look like this 0xF3017acEDd45526aC6153FBBCfcA8096173D245a.
- Download [VSCode](https://code.visualstudio.com/download) for live server extension (any other 
server will also work)
- Go to Extensions on the left panel search for liver server and install it.
- Open the folder containing this repo and down in the blue status bar and click on Go live.  

## Screenshots
Coming Soon.

## Credits
#### [Icons8](https://icons8.com/)
#### [Shields](https://shields.io/)
#### [Sharanda](https://github.com/sharanda/manrope)

## Additional Info.
You can reach out to me on [twitter](https://twitter.com/gupta_shrinath)

## License
Bloc App is licensed under MIT LICENSE.

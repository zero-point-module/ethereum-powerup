## Ethereum Powerup

Facilitate access to the latest Ethereum upgrades by powering your dummy Externally Owned Account into a future-proof modern ERC-7579 Modular Smart Account in just a few clicks. 
#


### Step 1: Connect your Wallet and Powerup
You will be signing an EIP-7702 authorization signature off-chain, which we will relay to the destination chain so you don't need to pay for gas.

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/91ba1433-8b6b-48ab-b0c1-ba6d00d0c58a" />

### Step 2: Install ERC-7579 Modules from the Module Store
Explore, install, and uninstall your desired features/modules from the decentralized and permissionless Module Store. In the next iteration, we will sort Modules by `Audited` with their respective audits and `Most Installed,` for which we will provide a subgraph to keep track.

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/c1984850-1119-4bec-805a-f27b5f34ebdd" />

### Q&A
1. Q: Why would I want to "power up" my Ethereum account in the first place? Isn't it good as it is already? <br /> 
1. A: With Account Modules, you can convert your dummy and limited EOA into a fully fledged Modular Smart Account, accessing a limitless, open-source, and permissionless set of custom wallet features. You could even build the next big module and share it with the community on the Module Store for everyone to play around with it. 
<br /> 

2. Q: Could you give me a practical example? I don't get it. <br /> 
2. A: Gotcha. Let's say your EOA's private key gets stolen or compromised. All your funds are now gone. You could prevent this from happening, even if they get to your private key. The tech is ready to prevent this. You can install a "Spending Limits" Module where you can pre-define how much your account can extract daily, and then it will require more signatures or delays for larger extractions. Complementing the limits, you can install a "Social Recovery" Module and ask your guardians to recover your account before your attacker can subtract more. The UX of a bank account, but decentralized.   
<br /> 

3. Q: What is a Modular Smart Wallet? Why modules? <br /> 
3. A: A Modular Smart Wallet follows the ERC-7579 Standard by organizing wallet features into minimal `modules` that can be `installed`, `uninstalled` and usually `configured` to enhance your smart wallet with custom features. This standard is widely adopted, massively increasing interoperability and reducing vendor lock-in. For example, a module built by `Safe` could potentially be installed in an `Alchemy` wallet and vice versa. Wallet features/modules should not be built and audited twice. Let's foster wallet interop!


### Technical components:
- ERC-4337: Account Abstraction Using Alt Mempool
- ERC-7579: Minimal Modular Smart Accounts 
- EIP-7702: Set EOA account code

### Available deployed contracts

**Ethereum Sepolia:**
- ERC-7559 Modular Account: 0x3E3E97AC0436F3e20E921b2DE5Cb954A3Dd18828
- ERC-7579 Social Recovery: 0x1A2cCD47aEEbd4B7D115758FdFb3C9339E7A4C87

**Worldcoin:**
- ERC-7559 Modular Account: 0x3E3E97AC0436F3e20E921b2DE5Cb954A3Dd18828
- ERC-7579 Social Recovery: 0x1A2cCD47aEEbd4B7D115758FdFb3C9339E7A4C87
  
**Optimism:**
- ERC-7559 Modular Account: 0x3E3E97AC0436F3e20E921b2DE5Cb954A3Dd18828
- ERC-7579 Social Recovery: 0x1A2cCD47aEEbd4B7D115758FdFb3C9339E7A4C87
  
**Mantle:**
- ERC-7559 Modular Account: 0x3E3E97AC0436F3e20E921b2DE5Cb954A3Dd18828
- ERC-7579 Social Recovery: 0xCd5134Cc7Fafaf1A391460de4781e70EC36C169a

**ZKSync:**
- ERC-7559 Modular Account: 0x2Bb775B3c88fcde6FCC0726574F790c8a5cAF676 
- ERC-7579 Social Recovery: `<getting errors at deployment>`
  

### Members:
Gonzalo Othacehe
Ignacio Presas
Esteban Viera

### Resources and Thanks:
EIP 7702: https://eips.ethereum.org/EIPS/eip-7702<br /> 
Ethers ERC-7702 impl: https://github.com/ethers-io/ethers.js/issues/4916<br /> 
Red Guild 7702 Playground: https://github.com/theredguild/7702-goat<br /> 
OpenZeppelin Draft Contracts:  https://github.com/OpenZeppelin/openzeppelin-community-contracts<br /> 
Ethereum Magicians: https://ethereum-magicians.org/t/eip-7702-set-eoa-account-code/19923<br /> 



### Disclaimer
All the code is unaudited, not properly tested, and still very experimental. <br /> 
DO NOT USE IN PRODUCTION. DO NOT INVOLVE PRIVATE KEYS WITH REAL FUNDS.

_Aleph Hackathon 2025 March_



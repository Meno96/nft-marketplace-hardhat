<h1 align="center">
    Hardhat NFT Marketplace
</h1>

<h2 align="center">
    <a href="https://nft-marketplace-nextjs2.vercel.app/">
        <strong><p>Website</p></strong>
    </a>
</h2>

<br/>

<p align="center">
<img src="./assets/GitHubImages/screen2.png" width="80%" alt="Hardhat NextJS Marketplace">
</a>
</p>

<br/>

This is a repo showing how to make an NFT Marketplace from scratch!

<hr/>
 
## 🗎&nbsp; Requirements
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
    
- [Nodejs](https://nodejs.org/en/)

    You'll know you've installed nodejs right if you can run: `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
   
   You'll know you've installed yarn right if you can run: `yarn --version` and get an output like: `x.x.x`
   
   You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## 🛠️&nbsp; How to run
- Clone the repo:
    ```
    git clone https://github.com/Meno96/nft-marketplace-hardhat.git
    ```
- Enter the directory:
    ```
    cd nft-marketplace-hardhat
    ```
- Install packages:
    ```
    yarn
    ```
    
## 🚀&nbsp; How it's suppose to work?

### Deploy

```
yarn hardhat deploy
```

### Testing

```
yarn hardhat test
```

#### Test Coverage

```
yarn hardhat coverage
```
 
### Deployment to a testnet or mainnet

1. Setup environment variables

    You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

    - `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
    - `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

    Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

    ```
    yarn hardhat deploy --network goerli
    ```

### Estimate gas

You can estimate how much gas things cost by running:

```
yarn hardhat test
```

And you'll see and output file called `gas-report.txt`

#### Estimate gas cost in USD

To get a USD estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from [CoinMarketCap](https://pro.coinmarketcap.com/signup). 

Then, uncomment the line `coinmarketcap: COINMARKETCAP_API_KEY,` in `hardhat.config.js` to get the USD estimation. Just note, everytime you run your tests it will use an API call, so it might make sense to have using coinmarketcap disabled until you need it. You can disable it by just commenting the line back out. 


### Verify on etherscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://etherscan.io/myapikey) from Etherscan and set it as an environemnt variable named `ETHERSCAN_API_KEY`. You can pop it into your `.env` file as seen in the `.env.example`.

In it's current state, if you have your api key set, it will auto verify goerli contracts!

However, you can manual verify with:

```
yarn hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```

### Linting

`solhint` installation: [Documentation](https://protofire.github.io/solhint/#installation)

To check linting / code formatting:
```
yarn lint
```

or, to fix: 

```
yarn lint:fix
```

### Formatting 

```
yarn format
```

## 🏴‍☠️&nbsp; Other Parts
You can find the frontend part in [this repository](https://github.com/Meno96/nft-marketplace-nextjs.git) 

and TheGraph part in [this repository](https://github.com/Meno96/nft-marketplace-thegraph.git)

## 📫&nbsp; Have a question? Want to chat? 

[LinkedIn](https://www.linkedin.com/in/daniele-menin/)

[Instagram](https://www.instagram.com/danielemeno96/)

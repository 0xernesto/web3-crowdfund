const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
	// Account mnemonic for account that will pay for deployment transaction
	process.env.ACCOUNT_MNEMONIC,

	// Infura API endpoint so that we can connect to node in public network (Rinkeby)
	process.env.INFURA_RINKEBY_NODE
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("\nAttempting to deploy from account", accounts[0], "\n");

	const result = await new web3.eth.Contract(
		JSON.parse(compiledFactory.interface)
	)
		.deploy({ data: compiledFactory.bytecode })
		.send({ gas: "1000000", from: accounts[0] });

	console.log(
		"\nContract deployed to address: ",
		result.options.address,
		"\n"
	);
	provider.engine.stop();
};
deploy();

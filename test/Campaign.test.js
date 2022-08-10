const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAdress;
let campaign;

beforeEach(async () => {
	// The getAccounts() function returns an array of all the accounts
	// on user’s Metamask wallet, where accounts[0] is the one currently
	// selected by the user.
	accounts = await web3.eth.getAccounts();

	// Deploy an isntance of the CampaignFactory contract by using the
	// compiledFactory JSON object defined above
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: "1000000" });

	// Deploy an instance of the Campaign contract by calling the
	// createCampaign function in the CampaignFactory contract.
	// The argument of createCampaign() is the minimum contribution (in Wei).
	await factory.methods.createCampaign("100").send({
		from: accounts[0],
		gas: "1000000",
	});

	/// Get array of addresses for all deployed instances of Campaign contract
	const deployedCampaigns = await factory.methods
		.getDeployedCampaigns()
		.call();
	// The first address in the deployedCampaigns array should be the latest one
	campaignAdress = deployedCampaigns[0];

	// Assign latest deployed Campaign contract instance to "campaign" variable.
	// Notice that since the contract has already been deployed, we are supplying
	// the address of the contract instance as the second argument below.
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAdress
	);
});

describe("Campaign", () => {
	// Make sure the contract deploys
	it("deploys a CampaignFactory and a Campaign contract instance", () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	// Make sure the address of whoever deploys the contract instances gets
	// assigned to be the campaign manager
	it("sssigns contract instance creator as the campaign manager", async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	// Make sure that people can contribute money to a campaign and that if they
	// contribute more than the minimum amount to the campaign, their address
	// gets added to the list of request approvers
	it("allows people to contribute money and marks them as approvers", async () => {
		await campaign.methods.contribute().send({
			value: "100",
			from: accounts[1],
		});

		// Check if "approvers" mapping contains the accounts[1] address.
		// If address is one of the keys in the "approvers" mapping, then
		// "isContributor" below will equal true
		const isContributor = await campaign.methods
			.approvers(accounts[1])
			.call();

		// If "isContributor" = true, the test will pass, else the test will fail
		assert(isContributor);
	});

	// Make sure that the campaign requires the manager to set a minimum contribution
	// at the time of deployment
	it("requires a minimum contribution", async () => {
		try {
			await campaign.methods.contribute().send({
				value: "5",
				from: accounts[1],
			});
			assert(false); // If no error is thown, this line will run, and our test will fail
		} catch (err) {
			assert(err); // If an error is caught, assert(err) will be true, and our test will pass
		}
	});

	// Make sure that the campaign manger has the ability to create request
	// The imputs for the createRequest function are description, value (in Wei),
	// and recipient (who the money will go to if the request is approved), which in
	// this case the recipient is accounts[1]
	it("allows the manager to create a request", async () => {
		await campaign.methods
			.createRequest("Buy something.", 100, accounts[1])
			.send({
				from: accounts[0],
				gas: "1000000",
			});

		// Retrieve requests that was just created.
		// The request is a struct with key value pairs.
		// The keys of a requests are description, value (in Wei), recipient (address),
		// complete (bool), and approvalCount.
		const request = await campaign.methods.requests(0).call();

		// Only checking description and assuming the rest are correct too
		assert.equal("Buy something.", request.description);
	});

	// Make sure that a request can be voted on, the manager can send the funds to the
	// recipient (if approved), and that the recipient receives the funds.
	// The manager is accounts[0] and the recipient is accounts[1]
	it("processes requests", async () => {
		// 1. Contribute some amount to the campaign
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei("10", "ether"),
		});

		// 2. Create a request
		await campaign.methods
			.createRequest(
				"Buy something else.",
				web3.utils.toWei("10", "ether"),
				accounts[1]
			)
			.send({
				from: accounts[0],
				gas: "1000000",
			});

		// 3. Approvers vote on the request (at index 0) - only 1/1 approvers for this
		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: "1000000",
		});

		// 4. Finalize request (at index 0) by sending money to recipient
		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: "1000000",
		});

		// 5. Make sure that the recipient received the funds from the contract manager
		let recipientBalance = await web3.eth.getBalance(accounts[1]);
		recipientBalance = web3.utils.fromWei(recipientBalance, "ether");

		// Take a number from a string and turn it into a decimal number
		recipientBalance = parseFloat(recipientBalance);

		console.log("\naccounts[1]", recipientBalance);
		assert(recipientBalance > 109);
	});
});

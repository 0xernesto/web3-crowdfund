/*
    Instead of compiling every time we start our project, we will compile only one time 
    and write the output to a file that we can read in the future for this Kickstart project.

    Any time we run compile.js we will:
    1. Delete the "build" directory (if it exists) inside the "Ethereum" directory.
    2. Read Campaign.sol from the "contracts" directory.
    3. Compile both "CampaignFactory" and "Campaign" contracts with solidity compiler.
    4. Write output to "build" directory inside the "Ethereum" directory.

    ** We only want to recompile when we make changes to our contracts.
*/

// ********** Start of Compilation Code ********** //
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// 1. Delete the "build" directory (if it exists).
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// 2. Read Campaign.sol from the "contracts" directory.
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// 3. Compile both "CampaignFactory" and "Campaign" contracts with solidity compiler.
const output = solc.compile(source, 1).contracts;

// 4. Create "build" directory and store the output in it
fs.ensureDirSync(buildPath);
for (let contract in output) {
	fs.outputJSONSync(
		path.resolve(buildPath, contract.replace(":", "") + ".json"),
		output[contract]
	);
}

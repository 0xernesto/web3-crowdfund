/*
    The purpose of this file is to configure web3 with a provider 
    and ensure that we are always using the same version of web3.
*/

import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
	// We are in the browser and metamask is running.
	window.ethereum.request({ method: "eth_requestAccounts" });
	web3 = new Web3(window.ethereum);
} else {
	// We are on the server *OR* the user is not running metamask
	const provider = new Web3.providers.HttpProvider(
		// Infura API endpoint so that we can connect to node in public network (Rinkeby)
		process.env.INFURA_RINKEBY_NODE
	);
	web3 = new Web3(provider);
}

export default web3;

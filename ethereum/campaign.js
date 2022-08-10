/**
 * The purpose of this file is to allow us to access our deployed
 * Campaign contract instances somewhere inside of our application
 * without going through the process laid out below. Instead, all we have
 * to do is import the campaign.js file wherever we need it.
 */

import web3 from "./web3";
import Campaign from "./build/Campaign.json";

export default (campaignAddress) => {
	return new web3.eth.Contract(
		JSON.parse(Campaign.interface),
		campaignAddress
	);
};

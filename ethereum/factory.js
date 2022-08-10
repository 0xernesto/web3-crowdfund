/**
 * The purpose of this file is to allow us to access our deployed
 * CampaignFactory contract instance somewhere inside of our application
 * without going through the process laid out below. Instead, all we have
 * to do is import the factory.js file wherever we need it.
 */

import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0x170f7F2532ca2DdEE002D43362DD92D62c758EFb"
);

export default instance;

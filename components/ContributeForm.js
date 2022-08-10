import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = ({ campaignAddress }) => {
	// State Management
	const [value, setValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event) => {
		// When the form is submitted, we need to prevent the browser from
		// autormatically attempting to submit the form to a backend server.
		event.preventDefault();

		setLoading(true);
		setErrorMessage("");

		// Get deployed Campaign contract address
		const campaign = Campaign(campaignAddress);

		try {
			// Get list of user's accounts
			const accounts = await web3.eth.getAccounts();

			// Send transaction object to contribute() function of the Campaign contract
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(value, "ether"),
			});

			// Refresh page so that we can display the latest state to the user after the
			// transaction has been completed. The getInitialProps event is responsible for
			// getting us this data, since we use it to call getSummary() and return the result
			// in the show.js file.
			Router.replaceRoute(`/campaigns/${campaignAddress}`);
		} catch (err) {
			setErrorMessage(err.message);
		}
		setLoading(false);
	};

	return (
		<Form onSubmit={onSubmit} error={!!errorMessage}>
			<Form.Field>
				<label>Amount to Contribute</label>
				<Input
					label="Ether"
					labelPosition="right"
					value={value}
					onChange={(event) => setValue(event.target.value)}
				/>
			</Form.Field>
			<Message error={true} header="Oh no!" content={errorMessage} />
			<Button primary={true} loading={loading}>
				Contribute!
			</Button>
		</Form>
	);
};

export default ContributeForm;

/**
 * This component allows users to create a new campaign.
 */
import React, { useState } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const NewCapmaign = () => {
	// State Management
	const [minimumContribution, setMinimumContribution] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event) => {
		// When the form is submitted, we need to prevent the browser from
		// autormatically attempting to submit the form to a backend server.
		event.preventDefault();

		setLoading(true);
		setErrorMessage("");

		try {
			// Get list of user's accounts
			const accounts = await web3.eth.getAccounts();

			// Create a new campaign through our factory.js file.
			// The user must have at least one account -> accounts[0]
			// so that he/she can pay for the trasaction.
			await factory.methods
				.createCampaign(minimumContribution)
				.send({ from: accounts[0] });
			// Redirect user to the main page (index.js)
			Router.pushRoute("/");
		} catch (err) {
			setErrorMessage(err.message);
		}

		setLoading(false);
	};

	return (
		<Layout>
			<h3>Create a Campaign</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>
						What do you want the minimum contribution to be for this
						campaign?
					</label>
					<Input
						label="Wei"
						labelPosition="right"
						value={minimumContribution}
						onChange={(event) =>
							setMinimumContribution(event.target.value)
						}
					/>
				</Form.Field>
				<Message error={true} header="Oh no!" content={errorMessage} />
				<Button primary={true} loading={loading}>
					Create
				</Button>
			</Form>
		</Layout>
	);
};

export default NewCapmaign;

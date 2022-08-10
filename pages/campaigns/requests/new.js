import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

const NewRequest = () => {
	// State Management
	const [value, setValue] = useState("");
	const [description, setDescription] = useState("");
	const [recipient, setRecipient] = useState("");

	return (
		<Layout>
			<h3>Create a Rewuest</h3>
			<Form>
				<Form.Field>
					<label>Description</label>
					<Input
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Value (Ether)</label>
					<Input
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Recipient</label>
					<Input
						value={recipient}
						onChange={(event) => setRecipient(event.target.value)}
					/>
				</Form.Field>
				<Button primary={true}>Create!</Button>
			</Form>
		</Layout>
	);
};

// getInitialProps is a lifecycle method, similar to componentDidMount()
// or the useEffect() hook, but exclusively for Next.js. We are using
// getInitialProps instead of componentDidMount() because Next.js makes
// use of server-side rendering, and componentDidMount() does not get
// executed until the component is rendered on the client.
NewRequest.getInitialProps = async (props) => {
	// Get address of deployed Campaign contract
	const campaignAddress = props.query.campaignAddress;
	return campaignAddress;
};

export default NewRequest;

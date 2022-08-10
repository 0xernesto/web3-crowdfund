/**
 *	index.js is picked up as the default page to display for the
 *	root route of the application.
 */

import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

// Use component-based class from the "react" library
class CampaignIndex extends Component {
	// getInitialProps is a lifecycle method, similar to componentDidMount()
	// or the useEffect() hook, but exclusively for Next.js. We are using
	// getInitialProps instead of componentDidMount() because Next.js makes
	// use of server-side rendering, and componentDidMount() does not get
	// executed until the component is rendered on the client.
	static async getInitialProps() {
		const campaigns = await factory.methods.getDeployedCampaigns().call();
		return { campaigns };
	}

	renderCampaigns() {
		// Generate an object from the campaigns array so that we can render
		// each campaign in a Card component from semantic-ui-react
		const items = this.props.campaigns.map((campaignAddress) => {
			return {
				header: campaignAddress,
				description: (
					<Link route={`/campaigns/${campaignAddress}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<div>
					<h3>Active Campaigns</h3>
					<Link route="/campaigns/new">
						<a>
							<Button
								content="Create Campaign"
								icon="add circle"
								primary={true}
								floated="right"
							/>
						</a>
					</Link>
					{this.renderCampaigns()}
				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;

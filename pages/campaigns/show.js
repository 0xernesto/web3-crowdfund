/**
 * This component allows users to see the details of a particular
 * campaign.
 */
import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

const ShowCampaign = ({
	campaignAddress,
	minimumContribution,
	balance,
	requestsCount,
	approversCount,
	manager,
}) => {
	const renderCards = () => {
		const items = [
			{
				header: manager,
				meta: "Address of Manager",
				description:
					"The manager created this campaign and can create requests to withdraw money.",
				style: { overflowWrap: "break-word" },
			},
			{
				header: minimumContribution,
				meta: "Minimum Contribution (Wei)",
				description:
					"You must contribute at least this much Wei to support the campaign and vote on how its funds get used.",
				style: { overflowWrap: "break-word" },
			},
			{
				header: requestsCount,
				meta: "Number of Requests",
				description:
					"A request tries to withdraw money from the campaign. Requests are submitted by the campaign manager and must be approved by the majority of contributors.",
				style: { overflowWrap: "break-word" },
			},
			{
				header: approversCount,
				meta: "Number of Approvers",
				description:
					"Number of people that have already contributed to this campaign.",
				style: { overflowWrap: "break-word" },
			},
			{
				header: web3.utils.fromWei(balance, "ether"),
				meta: "Campaign Balance (Ether)",
				description:
					"The balance is how much this campaign has left to spend.",
				style: { overflowWrap: "break-word" },
			},
		];
		return <Card.Group items={items} />;
	};

	return (
		<Layout>
			<h3>Show campaign details.</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>{renderCards()}</Grid.Column>
					<Grid.Column width={6}>
						<ContributeForm campaignAddress={campaignAddress} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link route={`/campaigns/${campaignAddress}/requests`}>
							<a>
								<Button primary={true}>View Requests</Button>
							</a>
						</Link>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

// getInitialProps is a lifecycle method, similar to componentDidMount()
// or the useEffect() hook, but exclusively for Next.js. We are using
// getInitialProps instead of componentDidMount() because Next.js makes
// use of server-side rendering, and componentDidMount() does not get
// executed until the component is rendered on the client.
ShowCampaign.getInitialProps = async (props) => {
	// Get access to deployed Campaign contract
	const campaign = Campaign(props.query.campaignAddress);

	// Get details of campaign in the form of an object
	const summary = await campaign.methods.getSummary().call();

	// Return the contents of summary one-by-one so that we can assign
	// labels to them, since they don't come labeled
	return {
		campaignAddress: props.query.campaignAddress,
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
	};
};

export default ShowCampaign;

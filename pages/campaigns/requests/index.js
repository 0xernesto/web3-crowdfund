import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";

const RequestIndex = ({ campaignAddress }) => {
	return (
		<Layout>
			<h3>Requests</h3>
			<Link route={`/campaigns/${campaignAddress}/requests/new`}>
				<a>
					<Button primary={true}>Add Request</Button>
				</a>
			</Link>
		</Layout>
	);
};

// getInitialProps is a lifecycle method, similar to componentDidMount()
// or the useEffect() hook, but exclusively for Next.js. We are using
// getInitialProps instead of componentDidMount() because Next.js makes
// use of server-side rendering, and componentDidMount() does not get
// executed until the component is rendered on the client.
RequestIndex.getInitialProps = async (props) => {
	// Get address of deployed Campaign contract
	const campaignAddress = props.query.campaignAddress;
	return campaignAddress;
};

export default RequestIndex;

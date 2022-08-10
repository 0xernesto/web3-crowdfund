import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
	return (
		<Menu style={{ marginTop: 10 }}>
			<Link route="/">
				<a className="item">Kickstart</a>
			</Link>
			<Menu.Menu position="right">
				<Link route="/">
					<a className="item">Active Campaigns</a>
				</Link>
				<Link route="/campaigns/new">
					<a className="item">Create New Campaign</a>
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
export default Header;

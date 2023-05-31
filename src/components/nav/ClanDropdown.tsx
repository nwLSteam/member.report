import React from "react";
import { Link } from "react-router-dom";
import Clan from "../../classes/Clan";
import "./Dropdown.scss";

interface ClanDropdownProps {
	list: Array<Clan>;
}

export default class ClanDropdown extends React.Component<ClanDropdownProps> {
	render() {
		if ( this.props.list.length === 0 ) {
			return null;
		}

		let elements = [];

		for ( const clan of this.props.list ) {
			elements.push(
				<Link className="Dropdown__element Dropdown__element--clan"
				        to={`/clan/${clan.data.groupId}`}
				        key={clan.data.groupId}
				        data-clan-id={clan.data.groupId}>
					<span className="Dropdown__name">{clan.data.name}</span>
					<span className="Dropdown__motto">{clan.data.motto}</span>
				</Link>,
			);
		}

		return (
			<div className="Clan">
				<div className="Dropdown">
					{elements}
				</div>
			</div>
		);
	}
}

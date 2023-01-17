import React from "react";
import Clan from "../classes/Clan";
import "./Dropdown.scss";

interface ClanDropdownProps {
	list: Array<Clan>;
	resultCallback: Function;
}

export default class ClanDropdown extends React.Component<ClanDropdownProps> {
	render() {
		if ( this.props.list.length === 0 ) {
			return null;
		}

		let elements = [];

		for ( const clan of this.props.list ) {
			elements.push(
				<button className="Dropdown__element"
				        onClick={() => this.props.resultCallback( clan.data.groupId )}
				        key={clan.data.groupId}
				        data-clan-id={clan.data.groupId}>
					<span className="Dropdown__name">{clan.data.name}</span>
					<span className="Dropdown__motto">{clan.data.motto}</span>
				</button>,
			);
		}

		return (
			<div className="Clan">
				<div className="Dropdown__header">Found Clan:</div>
				<div className="Dropdown">
					{elements}
				</div>
			</div>
		);
	}
}
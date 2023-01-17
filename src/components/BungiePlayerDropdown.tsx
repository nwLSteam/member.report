import React from "react";
import "./Dropdown.scss";
import Player from "../classes/Player";
import DropdownElement from "./DropdownElement";

interface BungiePlayerDropdownProps {
	list: Array<Player>;
	resultCallback: Function;
}

const MembershipTypeDict: { [key: number]: string } = {
	0: "Unknown",
	1: "Xbox",
	2: "PlayStation",
	3: "Steam",
	4: "Battle.net",
	5: "Stadia",
	10: "Demon",
	254: "Bungie Next",
};

export default class BungiePlayerDropdown extends React.Component<BungiePlayerDropdownProps> {
	render() {
		if ( this.props.list.length === 0 ) {
			return null;
		}

		let elements = [];

		for ( const player of this.props.list ) {

			let player_name = player.data.bungieGlobalDisplayName + "#" + player.data.bungieGlobalDisplayNameCode
				+ " (" + MembershipTypeDict[player.data.membershipType] + ")";

			let key = player.data.membershipId;

			if ( player.data.clan === null ) {
				elements.push(
					<DropdownElement key={key}
					                 active={false}
					                 username={player_name}
					                 subtitle={<i>Not a Destiny player</i>} />,
				);
			} else if ( player.data.clan === undefined ) {
				elements.push(
					<DropdownElement key={key}
					                 active={false}
					                 username={player_name}
					                 subtitle={<i>Loading</i>} />,
				);
			} else {
				if ( player.data.clan === "" ) {
					elements.push(
						<DropdownElement key={key}
						                 active={false}
						                 username={player_name}
						                 subtitle={<i>No Clan</i>} />,
					);
				} else {
					elements.push(
						<DropdownElement key={key}
						                 active={true}
						                 username={player_name}
						                 subtitle={player.data.clan.name}
						                 callback={( e ) => {
							                 e.preventDefault();
							                 this.props.resultCallback( player.data.clan.id );
						                 }} />,
					);
				}
			}
		}

		return (
			<div className="PlayerList">
				<div className="Dropdown__header">Bungie Players:</div>
				<div className="Dropdown">
					{elements}
				</div>
			</div>
		);
	}
}
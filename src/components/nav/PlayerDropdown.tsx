import React from "react";
import "./Dropdown.scss";
import Player from "../../classes/Player";
import DropdownElement from "./DropdownElement";

interface PlayerDropdownProps {
	list: Array<Player>;
	resultCallback: Function;
	heading: string;
}

export default class PlayerDropdown extends React.Component<PlayerDropdownProps> {
	render() {
		if ( this.props.list.length === 0 ) {
			return null;
		}

		let elements = [];

		let i = 0;
		for ( const player of this.props.list ) {

			let player_name = player.data.bungieGlobalDisplayName + "#" + player.data.bungieGlobalDisplayNameCode;

			//let key = player.data.bungieNetMembershipId;
			let key = ++i;

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
				<div className="Dropdown__header">{this.props.heading ?? "Found Players:"}</div>
				<div className="Dropdown">
					{elements}
				</div>
			</div>
		);
	}
}

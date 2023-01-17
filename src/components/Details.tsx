import React from "react";
import Clan from "../classes/Clan";
import "./Details.scss";
import Diagram from "./Diagram";

export default class Details extends React.Component<{ clanObject: Clan | null }> {
	render() {
		if ( this.props.clanObject === null ) {
			return null;
		}

		let clan = this.props.clanObject.data;


		let member_summary;

		if ( clan.hasOwnProperty( "members" ) ) {
			let members = [];
			for ( const member of clan.members ) {
				members.push(
					<li key={member.destinyUserInfo.displayName}>
						{member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName}
					</li>,
				);
			}

			member_summary = (
				<details className="Details__members">
					<summary>Members ({clan.members.length})</summary>
					{members}
				</details>
			);
		} else {
			member_summary = (
				<span className="Details__members"><i>Loading members...</i></span>
			);
		}


		if ( clan.hasOwnProperty( "members" ) ) {

		}

		return (
			<div className="Details">
				<h2 className="Details__name">{clan.detail.name}</h2>
				<span className="Details__motto"><i>{clan.detail.motto}</i></span>

				{member_summary}
				<hr />
				{this.props.clanObject.data.hasOwnProperty( "members" )
				&& <Diagram members={this.props.clanObject.data.members} />
				}
				<hr />
			</div>

		);
	}
}
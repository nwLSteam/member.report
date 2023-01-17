import { GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React from "react";
import Clan from "../classes/Clan";
import "./Details.scss";
import Diagram from "./Diagram";

function Details( props: {
	clan: GroupResponse | undefined,
	members: SearchResultOfGroupMember | undefined
} ) {
	if ( props.clan === undefined ) {
		return null;
	}

	if ( props.members === undefined ) {
		return null;
	}
	let clan = props.clan;

	let member_summary;

	if ( clan.hasOwnProperty( "members" ) ) {
		let members = [];
		for ( const member of props.members.results ) {
			members.push(
				<li key={member.destinyUserInfo.displayName}>
					{member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName}
				</li>,
			);
		}

		member_summary = (
			<details className="Details__members">
				<summary>Members ({props.members.totalResults})</summary>
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
			{props.members && <Diagram members={props.members} />}
			<hr />
		</div>

	);
}

export default Details;

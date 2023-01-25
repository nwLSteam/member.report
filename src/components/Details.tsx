import {
	DestinyHistoricalStatsAccountResult,
	DestinyHistoricalStatsWithMerged,
	ServerResponse,
} from "bungie-api-ts/destiny2";
import { GroupMember, GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./Details.scss";
import { Simulate } from "react-dom/test-utils";
import { StatKeyDictionary } from "../definitions/StatKeys";
import API from "../functions/API";
import DiagramForm from "./DiagramForm";
// import DiagramForm from "./DiagramForm";

export type PlayerStat = {
	stats: DestinyHistoricalStatsWithMerged
	membershipType: string
	membershipId: string
	bungieName: string
	bungieDiscriminator?: string
}

export type PlayerStats = {
	[key: string]: PlayerStat
};

function getTopPlayerForStat(
	data: any, // TODO
	stat: keyof typeof StatKeyDictionary,
) {

}

function loadPlayerStats( members: GroupMember[] | undefined,
                          setStats: Dispatch<SetStateAction<PlayerStats>>,
                          setFailed: Dispatch<SetStateAction<number>>,
) {
	if ( !members ) {
		return;
	}

	for ( const member of members ) {
		API.requests.Destiny2.Stats( member.destinyUserInfo.membershipType.toString(),
		                             member.destinyUserInfo.membershipId )
		   .then(
			   ( data ) => {
				   const parsed: ServerResponse<DestinyHistoricalStatsAccountResult> = JSON.parse( data );

				   const stat: PlayerStat = {
					   stats: parsed.Response.mergedAllCharacters,
					   membershipType: member.destinyUserInfo.membershipType.toString(),
					   membershipId: member.destinyUserInfo.membershipId,
					   bungieName: member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName,
					   bungieDiscriminator: member.bungieNetUserInfo?.bungieGlobalDisplayNameCode?.toString(),
				   };

				   let temp: PlayerStats = {
					   [stat.membershipId]: stat,
				   };

				   setStats( ( prevStats: PlayerStats ) => Object.assign( { ...prevStats }, temp ) );
			   },
		   )
		   .catch(
			   ( data ) => {
				   setFailed( ( i ) => i + 1 );
				   console.log( data );
			   },
		   );

	}
}

function Details( props: {
	clan: GroupResponse | undefined,
	members: SearchResultOfGroupMember | undefined
} ) {
	let { clan, members } = props;
	let [ stats, setStats ] = useState<PlayerStats>( {} );
	let [ failed, setFailed ] = useState<number>( 0 );
	useEffect( () => loadPlayerStats( members?.results, setStats, setFailed ), [ members ] );

	if ( !clan || !members ) {
		return null;
	}

	let member_summary = (
		<details className="Details__members">
			<summary>Members ({members.totalResults})</summary>
			{( () => {
				let member_list_elements = [];
				for ( const member of members.results ) {
					member_list_elements.push(
						<li key={member.destinyUserInfo.displayName}>
							{member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName}
						</li>,
					);
				}
				return member_list_elements;
			} )()}
		</details>
	);

	let loaded_players = Object.keys( stats ).length;
	let total_players = members?.results.length;
	const isLoadingComplete = () => loaded_players === total_players;

	if ( !isLoadingComplete() ) {
		return (
			<div className="Details">
				<h2 className="Details__name">{clan.detail.name}</h2>
				<span className="Details__motto"><i>{clan.detail.motto}</i></span>
				{member_summary}
				Loading details ({loaded_players} of {total_players})... {failed && <>({failed} failed)</>}
			</div>
		);
	}

	return (
		<div className="Details">
			<h2 className="Details__name">{clan.detail.name}</h2>
			<span className="Details__motto"><i>{clan.detail.motto}</i></span>

			{member_summary}
			<hr />
			<DiagramForm playerStats={stats} />
			<hr />
		</div>

	);
}

export default Details;

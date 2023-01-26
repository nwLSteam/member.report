import {
	DestinyHistoricalStatsAccountResult,
	DestinyHistoricalStatsWithMerged,
	ServerResponse,
} from "bungie-api-ts/destiny2";
import { GroupMember, GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./Details.scss";
import API from "../functions/API";
import DiagramForm from "./DiagramForm";
import CuratedTiles from "./tiles/CuratedTiles";
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

export function getStatFromDict(
	stat: PlayerStat,
	gamemode: "PvE" | "PvP",
	key: string,
	type: "basic" | "pga",
) {
	return stat?.stats?.results?.["all" + gamemode]?.allTime?.[key]?.[type]?.value ?? undefined;
}

function loadPlayerStats( members: GroupMember[] | undefined,
                          setStats: Dispatch<SetStateAction<PlayerStats>>,
                          setFailed: Dispatch<SetStateAction<number>>,
) {
	if ( !members ) {
		return;
	}

	setStats( {} );

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


class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
	constructor( props: any ) {
		super( props );
		this.state = { hasError: false };
	}

	static getDerivedStateFromError( error: any ) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch( error: Error, errorInfo: React.ErrorInfo ) {
	}

	render() {
		if ( this.state.hasError ) {
			// You can render any custom fallback UI
			return <h2>Something went wrong.</h2>;
		}

		return this.props.children;
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

	let member_summary = null;
	//	    (
	//	<details className="Details__members">
	//		<summary>Members ({members.totalResults})</summary>
	//		{( () => {
	//			let member_list_elements = [];
	//			for ( const member of members.results ) {
	//				member_list_elements.push(
	//					<li key={member.destinyUserInfo.displayName}>
	//						{member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName}
	//					</li>,
	//				);
	//			}
	//			return member_list_elements;
	//		} )()}
	//	</details>
	//);

	let loaded_players = Object.keys( stats ).length;
	let total_players = members?.results.length;
	const isLoadingComplete = () => loaded_players === total_players;

	if ( !isLoadingComplete() ) {
		return (
			<div className="Details">
				<h2 className="Details__name">{clan.detail.name}</h2>
				<div className="Details__motto">"{clan.detail.motto}"</div>
				{member_summary}
				<hr />
				<div className="Details__loading">
					<span>Loading...</span>
					<progress value={loaded_players} max={total_players} />
					{failed ? <span>({failed} failed)</span> : ""}
				</div>

			</div>
		);
	}

	return (
		<ErrorBoundary>
			<div className="Details">
				<h2 className="Details__name">{clan.detail.name}</h2>
				<div className="Details__motto">"{clan.detail.motto}"</div>

				{member_summary}
				<hr />
				<h3>Highlights</h3>
				<CuratedTiles playerStats={stats} />

				<h3>Statistics</h3>
				<span style={{ marginBottom: "10px", display: "block" }}>Click one or choose your own!</span>
				<DiagramForm playerStats={stats} />
			</div>
		</ErrorBoundary>
	);
}

export default Details;

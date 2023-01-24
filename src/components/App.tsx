import { ServerResponse } from "bungie-api-ts/destiny2";
import { GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { useEffect, useState } from "react";
import "./App.scss";
import ClanSearch from "./ClanSearch";
import Details from "./Details";
import API from "../functions/API";
import Credits from "./Credits";
import SmallDiagram, { DiagramData } from "./SmallDiagram";
import ChartTile from "./tiles/ChartTile";
import Tile from "./tiles/Tile";
import TopPlayerTile from "./tiles/TopPlayerTile";

function updateClan( clanID: string | undefined,
                     setClan: React.Dispatch<React.SetStateAction<undefined | GroupResponse>>,
) {
	if ( clanID === undefined ) {
		return;
	}

	API.requests.GroupV2.GetGroup( clanID )
	   .then( ( group_data ) => {
		   const data: ServerResponse<GroupResponse> = JSON.parse( group_data );
		   setClan( data.Response );
	   } );
}

function updateMembers( clan: GroupResponse | undefined,
                        setMembers: React.Dispatch<React.SetStateAction<undefined | SearchResultOfGroupMember>> ) {
	if ( clan === undefined ) {
		return;
	}

	API.requests.GroupV2.GetMembersOfGroup( clan.detail.groupId ).then( ( member_data ) => {
		const data: ServerResponse<SearchResultOfGroupMember> = JSON.parse( member_data );
		setMembers( data.Response );
	} );
}

function randomValues(): DiagramData {
	let data = [];

	for ( let i = 0; i < 5; i++ ) {
		data.push( {
			           x: Math.random(),
			           y: Math.random(),
		           } );
	}

	return data;
}

function App() {
	let [ clanID, setClanID ] = useState<string | undefined>( undefined );
	let [ clan, setClan ] = useState<GroupResponse | undefined>( undefined );
	useEffect( () => {
		updateClan( clanID, setClan );
	}, [ clanID ] );

	let [ members, setMembers ] = useState<SearchResultOfGroupMember | undefined>( undefined );
	useEffect( () => {
		updateMembers( clan, setMembers );
	}, [ clan ] );

	return (
		<div className="App">
			<nav className="App__nav">
				<h1>Destiny Member Report</h1>
				<ClanSearch resultCallback={setClanID} />
				<Credits />
			</nav>
			<main>
				<Details clan={clan} members={members} />
				<div style={{
					padding: "30px",
				}}>
					<h2>Highlights</h2>
					<div style={{
						display: "flex",
						gap: "30px",

					}}>
						<TopPlayerTile
							playerName={"PlayerName"}
							statisticLabel={"Top PvP K/D"}
							statisticValue={"5.0"}
							color={"Yellow"}
						/>
						<TopPlayerTile
							playerName={"PlayerName"}
							statisticLabel={"Top PvP K/D"}
							statisticValue={"5.0"}
							color={"Blue"}
						/>
						<TopPlayerTile
							playerName={"PlayerName"}
							statisticLabel={"Top PvP K/D"}
							statisticValue={"5.0"}
							color={"Red"}
						/>
					</div>
					<h2>Statistics</h2>
					<div style={{
						display: "flex",
						gap: "30px",

					}}>
						<ChartTile
							yName={"Average Kills"}
							xName={"Completed Activities"}
							color={"Green"}>
							<SmallDiagram x_name={"x_name"} y_name={"x_name"} data={randomValues()} />
						</ChartTile>
						<ChartTile
							yName={"Raids Completed"}
							xName={"PvP K/D"}
							color={"Green"}>
							<SmallDiagram x_name={"x_name"} y_name={"x_name"} data={randomValues()} />
						</ChartTile>
						<ChartTile
							yName={"Top PvP K/D"}
							xName={"PvP K/D"}
							color={"Green"}>
							<SmallDiagram x_name={"x_name"} y_name={"x_name"} data={randomValues()} />
						</ChartTile>
						<Tile color={"Gray"}>more...</Tile>
					</div>

				</div>

			</main>
		</div>
	);
}

export default App;

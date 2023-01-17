import { ServerResponse, SingleComponentResponse } from "bungie-api-ts/destiny2";
import { GroupMember, GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { useEffect, useState } from "react";
import "./App.scss";
import ClanSearch from "./ClanSearch";
import Details from "./Details";
import Clan from "../classes/Clan";
import API from "../functions/API";
import Credits from "./Credits";

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
			<header className="App-header">
				<h1>Destiny Member Report</h1>
				<ClanSearch resultCallback={setClanID} />
				<Credits />
				<Details clan={clan} members={members} />
			</header>
		</div>
	);
}

export default App;

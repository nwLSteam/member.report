import { ServerResponse } from "bungie-api-ts/destiny2";
import { GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "src/components/nav/Navbar";
import Details from "src/components/Details";
import API from "src/functions/API";

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

function DetailsPage() {
	let { id } = useParams();

	if ( !id ) {
		throw new Error( "invalid id" );
	}

	let [ clan, setClan ] = useState<GroupResponse | undefined>( undefined );
	useEffect( () => {updateClan( id, setClan );}, [ id ] );

	let [ members, setMembers ] = useState<SearchResultOfGroupMember | undefined>( undefined );
	useEffect( () => {updateMembers( clan, setMembers );}, [ clan ] );

	if ( !clan || !members ) {
		return null;
	}

	return <div className="App">
		<Navbar />
		<Details clan={clan} members={members} />
	</div>;
}

export default DetailsPage;

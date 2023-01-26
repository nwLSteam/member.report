import { ServerResponse } from "bungie-api-ts/destiny2";
import { GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { useEffect, useState } from "react";
import "./App.scss";
import ClanSearch from "./nav/ClanSearch";
import Details from "./Details";
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
				<ErrorBoundary>
					<Details clan={clan} members={members} />
				</ErrorBoundary>
			</main>
		</div>
	);
}

export default App;

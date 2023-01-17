import React from "react";
import "./App.scss";
import ClanSearch from "./ClanSearch";
import Details from "./Details";
import Clan from "../classes/Clan";
import API from "../functions/API";
import Credits from "./Credits";

interface AppStates {
	clan: Clan | null;
}

export default class App extends React.Component<{}, AppStates> {
	constructor( props: any ) {
		super( props );
		this.state = {
			clan: null,
		};

		this.setClanID = this.setClanID.bind( this );
	}

	public setClanID( clanID: string | null ) {
		if ( clanID === null ) {
			this.setState(
				{ clan: null },
			);
			return;
		}

		API.requests.GroupV2.GetGroup( clanID )
			.then( ( group_data ) => {
				group_data = JSON.parse( group_data );

				let clan = new Clan( group_data.Response );

				this.setState(
					{ clan: clan },
				);

				API.requests.GroupV2.GetMembersOfGroup( clanID ).then( ( member_data ) => {
					member_data = JSON.parse( member_data );
					clan.data.members = member_data.Response.results;

					this.setState( { clan: clan } );
				} );
			} );
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Destiny Member Report</h1>
					<Details clanObject={this.state.clan} />
					<ClanSearch resultCallback={this.setClanID} />
					<Credits/>
				</header>
			</div>
		);
	}
}

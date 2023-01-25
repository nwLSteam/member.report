import "./ClanSearch.scss";
import React from "react";
import ClanDropdown from "./ClanDropdown";
import Clan from "../../classes/Clan";
import API from "../../functions/API";
import Player from "../../classes/Player";
import PlayerDropdown from "./PlayerDropdown";
import BungiePlayerDropdown from "./BungiePlayerDropdown";

interface ClanSearchProps {
	resultCallback: Function;
}

interface ClanSearchState {
	clans: Array<Clan>;
	players: Array<Player>;
	bungiePlayers: Array<Player>;
}

export default class ClanSearch extends React.Component<ClanSearchProps, ClanSearchState> {
	constructor( props: any ) {
		super( props );
		this.searchFormEventHandler = this.searchFormEventHandler.bind( this );
		this.searchClans = this.searchClans.bind( this );
		this.searchPlayers = this.searchPlayers.bind( this );
		this.addClanToPlayers = this.addClanToPlayers.bind( this );
		this.state = {
			clans: [],
			players: [],
			bungiePlayers: [],
		};
	}

	searchClans( event: any ) {
		event.preventDefault();

		API.requests.Destiny2.GroupSearch( { name: event.target.q.value } )
			.then( data => {
				let clans: Clan[] = [];
				for ( const result of JSON.parse( data ).Response.results ) {
					clans.push( new Clan( result ) );
				}
				this.setState( ( prevState ) => ( { clans: clans } ) );
			} )
			.catch( e => console.error( e ) );
	}

	addClanToPlayers( players_list: Array<Player>, is_bungie_player: boolean ) {
		for ( const player_position in players_list ) {
			let player = players_list[player_position];

			if ( !is_bungie_player && player.data.destinyMemberships.length === 0 ) {
				// TODO: What do we do with people who just... don't play Destiny?
				players_list[player_position].data.clan = null;
				this.setState( { players: players_list } );
				continue;
			}

			let membershipId = is_bungie_player
				? player.data.membershipId
				: player.data.destinyMemberships[0].membershipId;
			let membershipType = is_bungie_player
				? player.data.membershipType
				: player.data.destinyMemberships[0].membershipType;

			API.requests.GroupV2.GetGroupsForMember( membershipId, membershipType )
				.then( ( data ) => {
					data = JSON.parse( data );

					if ( data.Response.totalResults === 0 ) {
						players_list[player_position].data.clan = "";
					} else {
						players_list[player_position].data.clan = {};
						players_list[player_position].data.clan.id = data.Response.results[0].group.groupId;
						players_list[player_position].data.clan.name = data.Response.results[0].group.name;
					}

					if ( is_bungie_player ) {
						this.setState( ( prevState ) => ( { bungiePlayers: players_list } ) );
					} else {
						this.setState( ( prevState ) => ( { players: players_list } ) );
					}

				} )
				.catch();
		}


	}

	searchPlayers( event: any ) {
		event.preventDefault();

		let query = event.target.q.value;

		API.requests.User.SearchByGlobalNamePost( query )
			.then( data => {

				let players: Player[] = [];
				for ( const result of JSON.parse( data ).Response.searchResults ) {
					players.push( new Player( result ) );
				}
				this.setState( ( prevState ) => ( { players: prevState.players } ),
					() => {
						this.addClanToPlayers( players, false );
					},
				);
			} )
			.catch( e => console.error( e ) );

		if ( query.includes( "#" ) ) {
			let name = query.split( "#" )[0];
			let denominator = query.split( "#" )[1];

			API.requests.Destiny2.SearchDestinyPlayerByBungieName( name, denominator )
				.then( ( data ) => {
					let players: Player[] = [];
					for ( const result of JSON.parse( data ).Response ) {
						players.push( new Player( result ) );
					}
					this.setState( ( prevState ) => ( { bungiePlayers: prevState.bungiePlayers } ),
						() => {
							this.addClanToPlayers( players, true );
						},
					);
				} )
				.catch( e => console.error( e ) );
		}
	}

	searchFormEventHandler( event: any ) {
		event.preventDefault();

		this.setState( {
			clans: [],
			players: [],
			bungiePlayers: [],
		} );

		if ( event.target.q.value !== "" ) {
			this.searchClans( event );
			this.searchPlayers( event );
		}
	}

	resultCallback() {
		let clanID = "";

		this.props.resultCallback( clanID );
	}

	render() {
		return (
			<div className="Search">
				<form className="Search__form" onSubmit={this.searchFormEventHandler}>
					{ /* <h3><label className="Search__label" htmlFor="q">Search Clan or Player</label></h3>--> */ }
					<input type="search" id="q" name="q" className="Search__input" placeholder={"Search clan or player..."} />
					<button type="submit" className="Search__submit">Search</button>
					<ClanDropdown list={this.state.clans}
					              resultCallback={( ...args: any ) => {
						              this.setState( {
							              clans: [],
							              players: [],
						              } );
						              this.props.resultCallback( ...args );
					              }} />
					<BungiePlayerDropdown list={this.state.bungiePlayers}
					                      resultCallback={( ...args: any ) => {
						                      this.setState( {
							                      clans: [],
							                      players: [],
							                      bungiePlayers: [],
						                      } );
						                      this.props.resultCallback( ...args );
					                      }} />
					<PlayerDropdown list={this.state.players}
					                heading="Found Players:"
					                resultCallback={( ...args: any ) => {
						                this.setState( {
							                clans: [],
							                players: [],
							                bungiePlayers: [],
						                } );
						                this.props.resultCallback( ...args );
					                }} />
				</form>
			</div>
		);
	}
}

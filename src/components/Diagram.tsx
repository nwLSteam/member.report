import React from "react";
import API from "../functions/API";
import { CartesianGrid, Label, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
// @ts-ignore
import { DefaultTooltipContent } from "recharts/lib/component/DefaultTooltipContent.js";

import "./Diagram.scss";

type Stats = {
	PvP: Array<string>,
	PvE: Array<string>,
};

const StatKeyDictionary: { [key: string]: any } = {
	"activitiesCleared": "Activities Cleared",
	"activitiesEntered": "Activities Entered",
	"assists": "Assists",
	"totalDeathDistance": "Total Death Distance",
	"averageDeathDistance": "Average Death Distance",
	"totalKillDistance": "Total Kill Distance",
	"averageKillDistance": "Average Kill Distance",
	"kills": "Kills",
	"secondsPlayed": "Seconds Played",
	"deaths": "Deaths",
	"averageLifespan": "Average Lifespan",
	"bestSingleGameKills": "Best Single Game Kills",
	"bestSingleGameScore": "Best Single Game Score",
	"opponentsDefeated": "Opponents Defeated",
	"efficiency": "Efficiency",
	"killsDeathsRatio": "K/D (without assists)",
	"killsDeathsAssists": "K/D (with assists)",
	"objectivesCompleted": "Objectives Completed",
	"precisionKills": "Precision Kills",
	"resurrectionsPerformed": "Resurrections Performed",
	"resurrectionsReceived": "Resurrections Received",
	"score": "Score",
	"heroicPublicEventsCompleted": "Heroic Public Events Completed",
	"adventuresCompleted": "Adventures Completed",
	"suicides": "Suicides",
	"weaponKillsAutoRifle": "Weapon Kills (Auto Rifle)",
	"weaponKillsBeamRifle": "Weapon Kills (Beam Rifle)",
	"weaponKillsBow": "Weapon Kills (Bow)",
	"weaponKillsGlaive": "Weapon Kills (Glaive)",
	"weaponKillsFusionRifle": "Weapon Kills (Fusion Rifle)",
	"weaponKillsHandCannon": "Weapon Kills (Hand Cannon)",
	"weaponKillsTraceRifle": "Weapon Kills (Trace Rifle)",
	"weaponKillsMachineGun": "Weapon Kills (Machine Gun)",
	"weaponKillsPulseRifle": "Weapon Kills (Pulse Rifle)",
	"weaponKillsRocketLauncher": "Weapon Kills (Rocket Launcher)",
	"weaponKillsScoutRifle": "Weapon Kills (Scout Rifle)",
	"weaponKillsShotgun": "Weapon Kills (Shotgun)",
	"weaponKillsSniper": "Weapon Kills (Sniper)",
	"weaponKillsSubmachinegun": "Weapon Kills (SMG)",
	"weaponKillsRelic": "Weapon Kills (Relic)",
	"weaponKillsSideArm": "Weapon Kills (Sidearm)",
	"weaponKillsSword": "Weapon Kills (Sword)",
	"weaponKillsAbility": "Weapon Kills (Ability)",
	"weaponKillsGrenade": "Weapon Kills (Grenade)",
	"weaponKillsGrenadeLauncher": "Weapon Kills (Grenade Launcher)",
	"weaponKillsSuper": "Weapon Kills (Super)",
	"weaponKillsMelee": "Weapon Kills (Melee)",
	"weaponBestType": "Weapon Best Type",
	"allParticipantsCount": "All Participants Count",
	"allParticipantsScore": "All Participants Score",
	"allParticipantsTimePlayed": "All Participants Time Played",
	"longestKillSpree": "Longest Kill Spree",
	"longestSingleLife": "Longest Single Life",
	"mostPrecisionKills": "Most Precision Kills",
	"orbsDropped": "Orbs Dropped",
	"orbsGathered": "Orbs Gathered",
	"publicEventsCompleted": "Public Events Completed",
	"remainingTimeAfterQuitSeconds": "Remaining Time After Quit Seconds",
	"teamScore": "Team Score",
	"totalActivityDurationSeconds": "Total Activity Duration Seconds",
	"fastestCompletionMs": "Fastest Completion (ms)",
	"longestKillDistance": "Longest Kill Distance",
	"highestCharacterLevel": "Highest Character Level",
	"highestLightLevel": "Highest Light Level",
	"fireTeamActivities": "Fireteam Activities",
	// PvP only:
	"activitiesWon": "Activities Won",
	"averageScorePerKill": "Average Score Per Kill",
	"averageScorePerLife": "Average Score Per Life",
	"winLossRatio": "Win-Loss-Ratio",
	"combatRating": "Combat Rating",
};

function getStatDictValue( key: string ) {
	return StatKeyDictionary[key] ?? key;
}

interface DiagramState {
	stats: { [key: string]: any };
	totalMembers: number;
	loadedMembers: number;
	failedMembers: number;
	selectableStats: Stats | null;
	diagramValues: Array<any> | null;
	x_name: { key: string, human: string },
	y_name: { key: string, human: string }
	tables: string
}

function CustomTooltip( props: any ) {
	// we don't need to check payload[0] as there's a better prop for this purpose
	if ( !props.active ) {
		// I think returning null works based on this: http://recharts.org/en-US/examples/CustomContentOfTooltip
		return null;
	}
	// mutating props directly is against react's conventions
	// so we create a new payload with the name and value fields set to what we want
	const newPayload = [
		{
			name: "Guardian",
			// all your data which created the tooltip is located in the .payload property
			value: props.payload[0].payload.name,
			// you can also add "unit" here if you need it
		},
		...props.payload,
	];

	// we render the default, but with our overridden payload
	return <DefaultTooltipContent {...props} payload={newPayload} />;
}

export default class Diagram extends React.Component<{ members: Array<any> }, DiagramState> {
	constructor( props: any ) {
		super( props );

		this.state = {
			stats: {},
			totalMembers: -1,
			loadedMembers: 0,
			failedMembers: 0,
			selectableStats: null,
			diagramValues: null,
			x_name: { key: "", human: "" },
			y_name: { key: "", human: "" },
			tables: "no", // 'no', 'x' or 'both'
		};

		this.renderDiagram = this.renderDiagram.bind( this );
		this.renderDiagramSelection = this.renderDiagramSelection.bind( this );
		this.generateSelectableStats = this.generateSelectableStats.bind( this );
	}

	componentDidMount() {
		this.setState( {
			totalMembers: this.props.members.length,
		} );

		for ( const member of this.props.members ) {
			API.requests.Destiny2.Stats( member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId )
				.then(
					( data ) => {
						let key: string = member.bungieNetUserInfo?.displayName ?? member.destinyUserInfo.displayName;

						let stats_object: { [key: string]: any } = {};
						stats_object[key] = JSON.parse( data ).Response;

						this.setState( ( prevState ) => ( {
							stats: Object.assign( prevState.stats, stats_object ),
							loadedMembers: prevState.loadedMembers + 1,
						} ), this.generateSelectableStats );
					},
				)
				.catch(
					( data ) => {
						this.setState( ( prevState ) => ( {
							loadedMembers: prevState.loadedMembers + 1,
							failedMembers: prevState.failedMembers + 1,
						} ) );
						console.log( data );
					},
				);

		}
	}

	generateSelectableStats() {
		if ( this.state.loadedMembers !== this.state.totalMembers ) {
			return null;
		}

		for ( let i = 0; i < this.state.totalMembers; i++ ) {
			let stats = this.state.stats[Object.keys( this.state.stats )[i]];

			let stats_obj: Stats = { PvP: [], PvE: [] };

			if ( !stats?.mergedAllCharacters?.results?.allPvE?.allTime
				|| !stats?.mergedAllCharacters?.results?.allPvP?.allTime
				|| stats?.mergedAllCharacters?.results?.allPvE?.allTime.length === 0
				|| stats?.mergedAllCharacters?.results?.allPvP?.allTime.length === 0
			) {
				continue;
			}

			for ( const statKey in stats.mergedAllCharacters.results.allPvE.allTime ) {
				stats_obj.PvE.push( statKey );
			}

			for ( const statKey in stats.mergedAllCharacters.results.allPvP.allTime ) {
				stats_obj.PvP.push( statKey );
			}

			this.setState( {
				selectableStats: stats_obj,
			} );
			return;
		}

		alert( "None of the players has any stats attached. Do you guys even play Destiny? I can't use this." );
		return null;

	}

	renderSelectableStats( name: string ) {
		if ( this.state.selectableStats === null ) {
			return null;
		}

		let PvE = [];
		let PvP = [];

		for ( const pvp_key of this.state.selectableStats.PvP ) {
			PvP.push(
				<option key={"PvP/" + pvp_key} value={"PvP/" + pvp_key}>
					{"PvP / " + StatKeyDictionary[pvp_key] ?? pvp_key}
				</option>,
			);
		}

		for ( const pve_key of this.state.selectableStats.PvE ) {
			PvE.push(
				<option key={"PvE/" + pve_key} value={"PvE/" + pve_key}>
					{"PvE / " + StatKeyDictionary[pve_key] ?? pve_key}
				</option>,
			);
		}

		return (
			<select name={name}>
				<optgroup label="PvE">
					{PvE}
				</optgroup>
				<optgroup label="PvP">
					{PvP}
				</optgroup>
			</select>
		);
	}

	updateDiagramValues( event: any ) {
		event.preventDefault();

		let data = [];

		let x_path = event.target.x_path.value;
		let x_type = event.target.x_type.value;
		let y_path = event.target.y_path.value;
		let y_type = event.target.y_type.value;

		let x_category = x_path.split( "/" )[0];
		let x_key = x_path.split( "/" )[1];
		let y_category = y_path.split( "/" )[0];
		let y_key = y_path.split( "/" )[1];


		for ( const key in this.state.stats ) {
			if ( !this?.state?.stats?.[key]?.mergedAllCharacters?.results?.["all" + x_category]?.["allTime"]?.[x_key]?.[x_type]?.value
				|| !this?.state?.stats?.[key]?.mergedAllCharacters?.results?.["all" + y_category]?.["allTime"]?.[y_key]?.[y_type]?.value ) {
				continue;
			}

			data.push( {
				name: key,
				x: this.state.stats[key].mergedAllCharacters.results["all" + x_category]["allTime"][x_key][x_type].value,
				y: this.state.stats[key].mergedAllCharacters.results["all" + y_category]["allTime"][y_key][y_type].value,
			} );
		}

		let tables;

		if ( event.target.render_tables.value === "yes" ) {
			if ( event.target.table_axis.value === "x" ) {
				tables = "x";
			} else {
				tables = "both";
			}
		} else {
			tables = "no";
		}

		this.setState( {
			diagramValues: data,
			x_name: {
				key: x_path + "/" + x_type,
				human: x_category + " / " + getStatDictValue( x_key ) + " (" + ( x_type === "basic" ? "Total" : "Average" ) + ")",
			},
			y_name: {
				key: y_path + "/" + y_type,
				human: y_category + " / " + getStatDictValue( y_key ) + " (" + ( y_type === "basic" ? "Total" : "Average" ) + ")",
			},
			tables: tables,
		} );
	}

	renderChart() {
		if ( this.state.diagramValues === null ) {
			return null;
		}

		console.log( "Rendering diagram." );

		return (
			<div className="Diagram__chart">
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart
						margin={{
							top: 20,
							right: 20,
							bottom: 20,
							left: 20,
						}}
					>
						<CartesianGrid />
						<XAxis type="number" dataKey="x" name={this.state.x_name.human}>
							<Label value={this.state.x_name.human} offset={0} position="bottom"
							       style={{ textAnchor: "middle", fontSize: "80%", fill: "rgba(255, 255, 255, 0.87)" }}
							/>
						</XAxis>
						<YAxis type="number" dataKey="y" name={this.state.y_name.human}>
							<Label value={this.state.y_name.human} angle={-90} offset={0} position="left"
							       style={{ textAnchor: "middle", fontSize: "80%", fill: "rgba(255, 255, 255, 0.87)" }}
							/>
						</YAxis>
						<Tooltip content={<CustomTooltip />}
						         separator=": "
						         cursor={{ strokeDasharray: "3 3" }}
						         formatter={
							         ( value: any, name: any, props: any ) =>
								         ( () => {
									         if ( typeof value !== "number" ) {
										         return value;
									         }

									         return Math.round( value * 100 ) / 100;
								         } )()
						         }
						/>
						<Scatter data={this.state.diagramValues} fill="#dddddd" />
					</ScatterChart>
				</ResponsiveContainer>
			</div>
		);
	}

	renderDiagramSelection() {
		if ( this.state.selectableStats === null ) {
			return;
		}

		return (
			<form className="Diagram__selection" onSubmit={( e ) => this.updateDiagramValues( e )}>
				<h3>X axis</h3>
				<div className="Diagram__dropdown-wrapper">
					{this.renderSelectableStats( "x_path" )}
					<select name="x_type">
						<option value="basic">(Total Value)</option>
						<option value="pga">(Game Average)</option>
					</select>
				</div>
				<h3>Y axis</h3>
				<div className="Diagram__dropdown-wrapper">
					{this.renderSelectableStats( "y_path" )}
					<select name="y_type">
						<option value="basic">(Total Value)</option>
						<option value="pga">(Game Average)</option>
					</select>
				</div>
				<h3>Show data tables?</h3>
				<div className="Diagram__dropdown-wrapper">
					<select name="render_tables">
						<option value="yes">Yes</option>
						<option value="no">No</option>
					</select>
					<select name="table_axis">
						<option value="x">(X axis only)</option>
						<option value="both">(both axes + ratio)</option>
					</select>
				</div>
				<button type="submit">Generate</button>
			</form>
		);
	}

	renderTables() {
		if ( this.state.diagramValues === null ) {
			return null;
		}

		if ( this.state.tables === "no" ) {
			return null;
		}

		const tableData: any[] = [];

		this.state.diagramValues.forEach( elem => {
			tableData.push( Object.assign( {}, elem ) );
		} );

		if ( this.state.tables === "both" ) {

			tableData.sort( ( a, b ) => {
				return ( b.y / b.x ) - ( a.y / a.x );
			} );
		} else {
			tableData.sort( ( a, b ) => {
				return b.x - a.x;
			} );
		}

		let table_body = [];

		if ( this.state.tables === "both" ) {
			for ( const tableDatum of tableData ) {
				table_body.push(
					<tr key={tableDatum.name}>
						<td>{tableDatum.name}</td>
						<td>{Math.round( tableDatum.x * 100 ) / 100}</td>
						<td>{Math.round( tableDatum.y * 100 ) / 100}</td>
						<td>{Math.round( ( tableDatum.y / tableDatum.x ) * 100 ) / 100}</td>
					</tr>,
				);
			}
		} else {
			for ( const tableDatum of tableData ) {
				table_body.push(
					<tr key={tableDatum.name}>
						<td>{tableDatum.name}</td>
						<td>{Math.round( tableDatum.x * 100 ) / 100}</td>
					</tr>,
				);
			}
		}

		let table_head;
		if ( this.state.tables === "both" ) {
			table_head = (
				<tr>
					<th>Guardian</th>
					<th>{this.state.x_name.human}</th>
					<th>{this.state.y_name.human}</th>
					<th>Ratio</th>
				</tr>
			);
		} else {
			table_head = (
				<tr>
					<th>Guardian</th>
					<th>{this.state.x_name.human}</th>
				</tr>
			);
		}

		return (
			<div className="Diagram__table-wrapper">
				<table className="Diagram__table">
					<thead>
					{table_head}
					</thead>
					<tbody>
					{table_body}
					</tbody>
				</table>
			</div>
		);
	}

	renderDiagram() {
		if ( this.state.loadedMembers !== this.state.totalMembers ) {
			return null;
		}

		return (
			<div className="Diagram">
				{this.renderDiagramSelection()}
				<div className="Diagram__hint">
					Hint: This tool takes raw Bungie API data and does not generate every possible combination. If you
					click 'Generate' and the diagram does not render, then one of the keys does not exist. For example,
					Bungie only saves lifetime K/D, not per-game-average (that wouldn't make much sense). Furthermore,
					some values (like some kill distances) are eternally stuck at zero until Bungie decides they're not.
				</div>
				{this.renderChart()}
				{this.renderTables()}
			</div>
		);
	}

	render() {
		return (
			<div className="Diagram__wrapper">
				<div className="Diagram__status">{
					this.state.totalMembers === -1
						? "Loading member list..."
						: this.state.loadedMembers === this.state.totalMembers
							? null // don't display if all members have loaded
							: ( `Loading member stats (${this.state.loadedMembers}/${this.state.totalMembers})` +
								( this.state.failedMembers > 0
									? ` (${this.state.failedMembers} request failed)...`
									: "..." ) )
				}</div>
				{this.renderDiagram()}
			</div>
		);
	}
}
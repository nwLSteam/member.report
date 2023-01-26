import React, { Dispatch, SetStateAction, useState } from "react";
import { CartesianGrid, Label, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
// @ts-ignore
import { DefaultTooltipContent } from "recharts/lib/component/DefaultTooltipContent.js";

import "./DiagramForm.scss";
import { StatKeyDictionary } from "../definitions/StatKeys";
import { PlayerStats } from "./Details";
import SmallDiagram from "./SmallDiagram";
import ChartTile from "./tiles/ChartTile";
import Tile, { TileColors } from "./tiles/Tile";
import tileStyle from "./tiles/tile.module.scss";
import { randomValues } from "../functions/data";

type SelectableStats = {
	PvP: Array<string>,
	PvE: Array<string>,
};

type DataPoint = {
	name: string
	x: number,
	y: number
};

interface DiagramValues {
	datapoints: DataPoint[],
	x_name: {
		key: string
		human_readable: string
	},
	y_name: {
		key: string
		human_readable: string
	},
	tables: "no" | "x" | "both"
}

// interface DiagramState {
// 	stats: {
// 		[key: string]: any;
// 	};
// 	totalMembers: number;
// 	loadedMembers: number;
// 	failedMembers: number;
// 	selectableStats: SelectableStats | null;
// 	diagramValues: Array<any> | null;
// 	x_name: {
// 		key: string,
// 		human: string;
// 	};
// 	y_name: {
// 		key: string,
// 		human: string;
// 	};
// 	tables: string;
// }

function getStatDictValue( key: string ) {
	return StatKeyDictionary[key as keyof typeof StatKeyDictionary] ?? key;
}

function CustomTooltip( props: any ) {
	// we don't need to check payload[0] as there's a better prop for this purpose
	if ( !props.active ) {
		// I think returning null works based on this: http://recharts.org/en-US/examples/CustomContentOfTooltip
		return null;
	}
	// mutating props directly is against React's conventions,
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


// function constructor( props: any ) {
// 	super( props );
//
// 	this.state = {
// 		stats: {},
// 		totalMembers: -1,
// 		loadedMembers: 0,
// 		failedMembers: 0,
// 		selectableStats: null,
// 		diagramValues: null,
// 		x_name: { key: "", human: "" },
// 		y_name: { key: "", human: "" },
// 		tables: "no", // 'no', 'x' or 'both'
// 	};
// }

/**
 * Creates a SelectableStats object from a PlayerStats object.
 *
 * @param {PlayerStats} stats The stats to generate the object for.
 * @return {SelectableStats | null} Usually SelectableStats,
 *      but null if none of the players in the clan has any stats attached.
 */
export function getSelectableStats( stats: PlayerStats ) {
	for ( let i = 0; i < Object.keys( stats ).length; i++ ) {
		// get ith entry by getting ith key
		let current = stats[Object.keys( stats )[i]];

		let stats_obj: SelectableStats = {
			PvE: [],
			PvP: [],
		};

		if ( !current?.stats.results?.allPvE?.allTime
			|| !current?.stats.results?.allPvP?.allTime
			|| Object.keys( current?.stats.results?.allPvE?.allTime ).length === 0
			|| Object.keys( current?.stats.results?.allPvP?.allTime ).length === 0
		) {
			// if this stat is broken, continue
			continue;
		}

		for ( const statKey in current.stats.results.allPvE.allTime ) {
			stats_obj.PvE.push( statKey );
		}

		for ( const statKey in current.stats.results.allPvP.allTime ) {
			stats_obj.PvP.push( statKey );
		}

		return stats_obj;
	}

	// FIXME
	// alert( "The player stats are messed up. Either no one plays Destiny or something is up. The site might crash now. Sorry." );
	return null;
}

/**
 * Generates an HTML <select> object from selectable stats.
 *
 * @param name The name of the <select> object.
 * @param stats The SelectableStats object to take the data from.
 */
export function getSelectableStatsList( name: string, stats: SelectableStats ) {
	let PvE = [];
	let PvP = [];

	for ( const pvp_key of stats.PvP ) {
		PvP.push(
			<option key={"PvP/" + pvp_key} value={"PvP/" + pvp_key}>
				{"PvP / " + StatKeyDictionary[pvp_key as keyof typeof StatKeyDictionary] ?? pvp_key}
			</option>,
		);
	}

	for ( const pve_key of stats.PvE ) {
		PvE.push(
			<option key={"PvE/" + pve_key} value={"PvE/" + pve_key}>
				{"PvE / " + StatKeyDictionary[pve_key as keyof typeof StatKeyDictionary] ?? pve_key}
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

/**
 * TODO ?
 */
function getDiagramValues( stats: PlayerStats,
                           event: any,
                           setDiagramValues: Dispatch<SetStateAction<DiagramValues | undefined>> ) {
	event.preventDefault();


	let x_path: string = event.target.x_path.value;
	let y_path: string = event.target.y_path.value;

	// TODO: put this type somewhere
	let x_type: "basic" | "pga" = event.target.x_type.value;
	let y_type: "basic" | "pga" = event.target.y_type.value;

	let x_key: string = x_path.split( "/" )[1];
	let x_category: string = x_path.split( "/" )[0];
	let x_category_key: string = "all" + x_category;

	let y_category: string = y_path.split( "/" )[0];
	let y_key: string = y_path.split( "/" )[1];
	let y_category_key: string = "all" + y_category;

	let data_points: DataPoint[] = [];
	for ( const key in stats ) {
		if ( !stats?.[key]?.stats.results?.[x_category_key]?.["allTime"]?.[x_key]?.[x_type]?.value
			|| !stats?.[key]?.stats?.results?.[y_category_key]?.["allTime"]?.[y_key]?.[y_type]?.value ) {
			// if this user doesn't have a stat in this category, continue
			continue;
		}

		const datapoint: DataPoint = {
			name: stats[key].bungieName,
			x: stats[key].stats.results[x_category_key]["allTime"][x_key][x_type].value,
			y: stats[key].stats.results[y_category_key]["allTime"][y_key][y_type].value,
		};

		data_points.push( datapoint );
	}

	let tables: "no" | "x" | "both";

	if ( event.target.render_tables.value === "yes" ) {
		if ( event.target.table_axis.value === "x" ) {
			tables = "x";
		} else {
			tables = "both";
		}
	} else {
		tables = "no";
	}

	setDiagramValues( {
		                  datapoints: data_points,
		                  x_name: {
			                  key: x_path + "/" + x_type,
			                  human_readable: x_category + " / " + getStatDictValue( x_key )
				                  + " (" + ( x_type === "basic" ? "Total" : "Average" ) + ")",
		                  },
		                  y_name: {
			                  key: y_path + "/" + y_type,
			                  human_readable: y_category + " / " + getStatDictValue( y_key )
				                  + " (" + ( y_type === "basic" ? "Total" : "Average" ) + ")",
		                  },
		                  tables: tables,
	                  } );

}

function renderChart( diagramValues: DiagramValues ) {
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
					<XAxis type="number" dataKey="x" name={diagramValues.x_name.human_readable}>
						<Label value={diagramValues.x_name.human_readable} offset={0} position="bottom"
						       style={{ textAnchor: "middle", fontSize: "80%", fill: "rgba(255, 255, 255, 0.87)" }}
						/>
					</XAxis>
					<YAxis type="number" dataKey="y" name={diagramValues.y_name.human_readable}>
						<Label value={diagramValues.y_name.human_readable} angle={-90} offset={0} position="left"
						       style={{ textAnchor: "middle", fontSize: "80%", fill: "rgba(255, 255, 255, 0.87)" }}
						/>
					</YAxis>
					<Tooltip content={<CustomTooltip />}
					         separator=": "
					         cursor={{ strokeDasharray: "3 3" }}
					         formatter={
						         ( value: any, _name: any, _props: any ) =>
							         ( () => {
								         if ( typeof value !== "number" ) {
									         return value;
								         }

								         return Math.round( value * 100 ) / 100;
							         } )()
					         }
					/>
					<Scatter data={diagramValues.datapoints} fill="#dddddd" />
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	);
}

type DiagramPath = `PvE/${keyof typeof StatKeyDictionary}` | `PvP/${keyof typeof StatKeyDictionary}`

interface DiagramPreset {
	label: string
	color: keyof typeof TileColors,
	data: {
		x_path: { value: DiagramPath },
		y_path: { value: DiagramPath },
		x_type: { value: "basic" | "pga" },
		y_type: { value: "basic" | "pga" },
		render_tables: "no"
	}

}

interface PseudoEvent {
	target: DiagramPreset["data"];
	preventDefault: () => void;
}

const diagramPresets: DiagramPreset[] = [
	{
		label: "More PvP games played = higher K/D?",
		color: "Red",
		data: {
			x_path: { value: "PvP/activitiesEntered" },
			y_path: { value: "PvP/killsDeathsRatio" },
			x_type: { value: "basic" },
			y_type: { value: "basic" },
			render_tables: "no",
		},
	},
	{
		label: "Are nicer players more efficient?",
		color: "Blue",
		data: {
			x_path: { value: "PvE/resurrectionsPerformed" },
			y_path: { value: "PvE/efficiency" },
			x_type: { value: "pga" },
			y_type: { value: "basic" },
			render_tables: "no",
		},
	},
	{
		label: "Are sacrificial players more efficient?",
		color: "Red",
		data: {
			x_path: { value: "PvP/suicides" },
			y_path: { value: "PvP/killsDeathsAssists" },
			x_type: { value: "pga" },
			y_type: { value: "basic" },
			render_tables: "no",
		},
	},
	{
		label: "Can people with more assists carry their own weight?",
		color: "Red",
		data: {
			x_path: { value: "PvP/assists" },
			y_path: { value: "PvP/killsDeathsAssists" },
			x_type: { value: "pga" },
			y_type: { value: "basic" },
			render_tables: "no",
		},
	},
];

/**
 * Renders the entire form for the diagram.
 *
 * @param playerStats The player stats to build upon.
 * @param xKey The currently selected xKey.
 * @param setXKey A function to set the xKey.
 * @param yKey The currently selected yKey.
 * @param setYKey A function to set the yKey.
 * @param setDataPoints A function to set the diagram data points.
 */
function renderDiagramSelection(
	playerStats: PlayerStats,
	xKey: string | undefined,
	setXKey: Dispatch<SetStateAction<string | undefined>>,
	yKey: string | undefined,
	setYKey: Dispatch<SetStateAction<string | undefined>>,
	setDataPoints: Dispatch<SetStateAction<DiagramValues | undefined>>,
) {
	const stats = getSelectableStats( playerStats );
	if ( stats === null ) {
		return;
	}

	let preset_elements = [];

	for ( const diagramPreset of diagramPresets ) {
		let preset_event: PseudoEvent = {
			target: diagramPreset.data,
			preventDefault: () => {
			},
		};

		preset_elements.push( <ChartTile
			key={diagramPreset.label}
			name={diagramPreset.label}
			color={diagramPreset.color}
			onclick={() =>
				getDiagramValues( playerStats, preset_event, setDataPoints )
			}>
			<SmallDiagram data={randomValues()} />
		</ChartTile> );
	}

	return (
		<div className={tileStyle.wrapper}>
			{preset_elements}
			<Tile color={"Gray"}>
				<form className="Diagram__selection"
				      onSubmit={( e ) => getDiagramValues( playerStats, e, setDataPoints )}>
					<div className="Diagram__dropdown-wrapper">
						{getSelectableStatsList( "y_path", stats )}
						<select name="y_type">
							<option value="basic">(Total Value)</option>
							<option value="pga">(Game Average)</option>
						</select>
					</div>
					<div>depending on</div>
					<div className="Diagram__dropdown-wrapper">
						{getSelectableStatsList( "x_path", stats )}
						<select name="x_type">
							<option value="basic">(Total Value)</option>
							<option value="pga">(Game Average)</option>
						</select>
					</div>

					<input type="hidden" name="render_tables" value="no" />
					{/*
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
				*/}
					<button type="submit">Generate</button>
				</form>
			</Tile>
		</div>
	);
}

function renderTables( diagramValues: DiagramValues ) {
	if ( diagramValues.tables === "no" ) {
		return null;
	}

	const tableData: DataPoint[] = [];
	diagramValues.datapoints.forEach( elem => {
		tableData.push( Object.assign( {}, elem ) );
	} );

	if ( diagramValues.tables === "both" ) {
		tableData.sort( ( a, b ) => {
			return ( b.y / b.x ) - ( a.y / a.x );
		} );
	} else {
		tableData.sort( ( a, b ) => {
			return b.x - a.x;
		} );
	}

	let table_body = [];

	if ( diagramValues.tables === "both" ) {
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
	if ( diagramValues.tables === "both" ) {
		table_head = (
			<tr>
				<th>Guardian</th>
				<th>{diagramValues.x_name.human_readable}</th>
				<th>{diagramValues.y_name.human_readable}</th>
				<th>Ratio</th>
			</tr>
		);
	} else {
		table_head = (
			<tr>
				<th>Guardian</th>
				<th>{diagramValues.x_name.human_readable}</th>
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


function DiagramForm( props: {
	playerStats: PlayerStats
} ) {
	let [ xKey, setXKey ] = useState<string | undefined>( undefined );
	let [ yKey, setYKey ] = useState<string | undefined>( undefined );
	let [ diagramValues, setDiagramValues ] = useState<DiagramValues | undefined>( undefined );

	return (
		<div className="Diagram__wrapper">
			<div className="Diagram">
				{renderDiagramSelection( props.playerStats, xKey, setXKey, yKey, setYKey, setDiagramValues )}
				{diagramValues && <div className="Diagram__block">
					{renderChart( diagramValues )}
					{renderTables( diagramValues )}
					<div className="Diagram__hint">
						Hint: This tool takes raw Bungie API data and does not generate every possible combination. If
						you click 'Generate' and the diagram does not render, then one of the keys does not exist. For
						example, Bungie only saves lifetime K/D, not per-game-average (that wouldn't make much sense).
						Furthermore, some values (like some kill distances) are eternally stuck at zero until Bungie
						decides they're not.
					</div>
				</div>}
			</div>
		</div>
	);
}


export default DiagramForm;

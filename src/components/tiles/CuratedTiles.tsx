import { stat } from "fs";
import React from "react";
import { StatKeyDictionary } from "../../definitions/StatKeys";
import { getStatFromDict, PlayerStats } from "../Details";
import { TileColors } from "./Tile";
import TopPlayerTile from "./TopPlayerTile";
import tileStyle from "./tile.module.scss";

interface CuratedTile {
	label: string;
	color: keyof typeof TileColors;
	gamemode: "PvE" | "PvP";
	key: keyof typeof StatKeyDictionary;
	type: "basic" | "pga";

}

const curatedTiles: CuratedTile[] = [
	{
		label: "Highest Light Level",
		color: "Yellow",
		gamemode: "PvE",
		key: "highestLightLevel",
		type: "basic",
	},
	{
		label: "Most time in PvE",
		color: "Green",
		gamemode: "PvE",
		key: "secondsPlayed",
		type: "basic",
	},
	{
		label: "Most time in PvP",
		color: "Green",
		gamemode: "PvP",
		key: "secondsPlayed",
		type: "basic",
	},
	{
		label: "Most PvE activities",
		color: "Blue",
		gamemode: "PvE",
		key: "activitiesCleared",
		type: "basic",
	},
	{
		label: "Top PvE K/D",
		color: "Blue",
		gamemode: "PvE",
		key: "killsDeathsRatio",
		type: "basic",
	},
	{
		label: "Most suicidal (PvE)",
		color: "Blue",
		gamemode: "PvE",
		key: "suicides",
		type: "pga",
	},
	{
		label: "Most PvP activities",
		color: "Red",
		gamemode: "PvP",
		key: "activitiesEntered",
		type: "basic",
	},
	{
		label: "Top PvP K/D",
		color: "Red",
		gamemode: "PvP",
		key: "killsDeathsRatio",
		type: "basic",
	},
	{
		label: "Most suicidal (PvP)",
		color: "Red",
		gamemode: "PvP",
		key: "suicides",
		type: "pga",
	},
];

function roundToXDigits( value: number, digits: number ) {
	value = value * Math.pow( 10, digits );
	value = Math.round( value );
	value = value / Math.pow( 10, digits );
	return value;
}

function CuratedTiles( props: {
	playerStats: PlayerStats
} ) {

	let tiles = [];

	for ( const curatedTile of curatedTiles ) {
		let stats = Object.assign( {}, props.playerStats );
		let entries = Object.values( stats );
		entries.sort( ( a, b ) => {
			let a_stat = getStatFromDict( a, curatedTile.gamemode, curatedTile.key, curatedTile.type );
			let b_stat = getStatFromDict( b, curatedTile.gamemode, curatedTile.key, curatedTile.type );

			return b_stat - a_stat;
		} );
		let top_player = entries[0];

		let stat = roundToXDigits( getStatFromDict( top_player,
		                                            curatedTile.gamemode,
		                                            curatedTile.key,
		                                            curatedTile.type ), 2 ).toString();

		tiles.push( <TopPlayerTile
			key={curatedTile.label}
			playerName={top_player.bungieName}
			color={curatedTile.color}
			statisticLabel={curatedTile.label}
			statisticValue={stat} />,
		);
	}

	return <div className={tileStyle.wrapper}>
		{tiles}
	</div>;
}

export default CuratedTiles;

import React, { Dispatch, SetStateAction, useState } from "react";
import { getStatFromDict, PlayerStats } from "../Details";
import { getSelectableStats, getSelectableStatsList } from "../DiagramForm";
import { roundToXDigits } from "./CuratedTiles";
import Tile from "./Tile";
import tileStyle from "./tile.module.scss";

function getTopPlayer( playerStats: PlayerStats, gamemode: "PvP" | "PvE", key: string, type: "basic" | "pga" ) {
	let stats = Object.assign( {}, playerStats );
	let entries = Object.values( stats );
	entries.sort( ( a, b ) => {
		let a_stat = getStatFromDict( a, gamemode, key, type );
		let b_stat = getStatFromDict( b, gamemode, key, type );

		return b_stat - a_stat;
	} );
	let top_player = entries[0];

	let rawStat = getStatFromDict( top_player, gamemode, key, type );
	if ( rawStat === undefined ) {
		return undefined;
	}

	let stat = roundToXDigits( rawStat, 2 ).toString();

	return {
		player: top_player.bungieName,
		value: stat,
	};
}

function updateTile( event: any,
                     stats: PlayerStats,
                     setTopPlayer: Dispatch<SetStateAction<string | undefined>>,
                     setStat: Dispatch<SetStateAction<string | undefined>>,
) {
	const form: HTMLFormElement = event.target.form;

	let path_select = ( ( form.querySelector( "[name='top_category']" )! ) as HTMLSelectElement );
	let type_select = ( ( form.querySelector( "[name='top_type']" )! ) as HTMLSelectElement );

	let path: string = path_select.options[path_select.selectedIndex].value;
	let type: "basic" | "pga" = type_select.options[type_select.selectedIndex].value as "basic" | "pga";

	let key: string = path.split( "/" )[1];
	let gamemode: "PvP" | "PvE" = path.split( "/" )[0] as "PvP" | "PvE";

	let top = getTopPlayer( stats, gamemode, key, type );

	if ( top === undefined ) {
		setTopPlayer( undefined );
		setStat( undefined );
		return;
	}

	setTopPlayer( top.player );
	setStat( top.value );
}

function PseudoTopPlayerTile( props: {
	stats: PlayerStats
} ) {
	let [ topPlayer, setTopPlayer ] = useState<string | undefined>( undefined );
	let [ stat, setStat ] = useState<string | undefined>( undefined );

	const { stats } = props;
	const selectable = getSelectableStats( stats );
	if ( !selectable ) {
		return null;
	}
	const list = getSelectableStatsList( "top_category", selectable );


	return <Tile color={"Gray"}>
		<form className={tileStyle.selection} onChange={e => updateTile( e, stats, setTopPlayer, setStat )}>
			{list}
			<select name="top_type">
				<option value="basic">(Total Value)</option>
				<option value="pga">(Game Average)</option>
			</select>
		</form>
		<div className={tileStyle.player}>{topPlayer}</div>
		<div className={tileStyle.value}>{stat === undefined ? "Invalid selection" : stat}</div>
	</Tile>;
}

export default PseudoTopPlayerTile;

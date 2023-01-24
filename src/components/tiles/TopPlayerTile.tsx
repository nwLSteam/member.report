import React from "react";
import Tile, { TileColors } from "./Tile";
import tileStyle from "./tile.module.scss";

function TopPlayerTile( props: {
	statisticLabel: string
	statisticValue: string
	playerName: string
	color: keyof typeof TileColors
} ) {
	const { playerName, statisticLabel, statisticValue, color } = props;

	return <Tile color={color}>
		<div className={tileStyle.label}>{statisticLabel}:</div>
		<div className={tileStyle.player}>{playerName}</div>
		<div className={tileStyle.value}>{statisticValue}</div>
	</Tile>;
}

export default TopPlayerTile;

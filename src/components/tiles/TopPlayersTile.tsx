import React from "react";
import Tile, { TileColors } from "./Tile";
import tileStyle from "./tile.module.scss";

function TopPlayerTile( props: {
	statisticLabel: string
	tableData: Array<{
		playerName: string
		statisticValue: string
	}>
	color: keyof typeof TileColors
} ) {
	const { statisticLabel, tableData, color } = props;

	return <Tile color={color}>
		<div className={tileStyle.label}>{statisticLabel}:</div>
		<table className={tileStyle.table}>
			<tbody>
			{( () => {
				let rows = [];
				for ( const tableElement of tableData ) {
					rows.push( <tr key={tableElement.playerName} className={tileStyle.playerrow}>
						<td className={tileStyle.playername}>{tableElement.playerName}</td>
						<td className={tileStyle.playervalue}>{tableElement.statisticValue}</td>
					</tr> );
				}
				return rows;
			} )()}
			</tbody>
		</table>
	</Tile>;
}

export default TopPlayerTile;

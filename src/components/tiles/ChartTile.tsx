import React from "react";
import Tile, { TileColors } from "./Tile";

function ChartTile( props: React.PropsWithChildren<{
	onclick: () => void
	name: string
	color: keyof typeof TileColors
}> ) {
	const { onclick, name, color } = props;
	return <Tile
		onclick={onclick}
		style={{
		width: "10rem",
		height: "12rem",
		fontSize: "0.8em",
	}} color={color}>
		<div style={{
			height: "100%",
			width: "100%",
			maxHeight: "100%",
			maxWidth: "100%",
		}}> {props.children}</div>
		<div>{name}</div>
	</Tile>;
}

export default ChartTile;

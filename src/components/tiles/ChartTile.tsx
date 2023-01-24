import React from "react";
import SmallDiagram, { DiagramData } from "../SmallDiagram";
import TileStatistic from "./parts/TileStatistic";
import Tile, { TileColors } from "./Tile";
import tileStyle from "./tile.module.scss";

function ChartTile( props: React.PropsWithChildren<{
	yName: string
	xName: string
	color: keyof typeof TileColors
}> ) {
	const { xName, yName, color } = props;

	return <Tile style={{
		width: "10rem",
		height: "12rem",
		fontSize: "0.8em"
	}} color={color}>
		<div style={{
			height: "100%",
			width: "100%",
			maxHeight: "100%",
			maxWidth: "100%",
		}}> {props.children}</div>
		<div>{yName}</div>
		<div className={tileStyle.inbetween}>depending on</div>
		<div>{xName}</div>
	</Tile>;
}

export default ChartTile;

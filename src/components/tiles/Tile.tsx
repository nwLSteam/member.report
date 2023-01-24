import React, { CSSProperties } from "react";
import tileStyle from "./tile.module.scss";

export const TileColors = {
	Blue: tileStyle.blue,
	Red: tileStyle.red,
	Green: tileStyle.green,
	Yellow: tileStyle.yellow,
	Gray: tileStyle.gray
};

function Tile( props: React.PropsWithChildren<{
	color: keyof typeof TileColors
	style?: CSSProperties
}> ) {
	return <div style={props.style} className={TileColors[props.color]}>
		{props.children}
	</div>;
}

export default Tile;

import React from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

export type DiagramData = {
	x: number,
	y: number,
	name?: string
} []

function SmallDiagram( props: {
	data: DiagramData
} ) {
	return <ResponsiveContainer width="100%" height="100%">
		<ScatterChart
			margin={{
				top: 20,
				right: 20,
				bottom: 20,
				left: 20,
			}}
		>
			<CartesianGrid />
			<XAxis hide={true} type="number" dataKey="x" />
			<YAxis hide={true} type="number" dataKey="y" />
			<Scatter line lineType={"fitting"} data={props.data} fill="#dddddd" />
		</ScatterChart>
	</ResponsiveContainer>;
}

export default SmallDiagram;

import React from "react";
import s from "./ClassDistribution.module.scss";

function ClassDistribution( props: {
	ratios: {
		Hunter: number
		Warlock: number
		Titan: number
	}
} ) {
	const ratios = props.ratios;
	const sum = ( ratios.Hunter + ratios.Warlock + ratios.Titan );
	const hunterNorm = ratios.Hunter / sum;
	const warlockNorm = ratios.Warlock / sum;
	const titanNorm = ratios.Titan / sum;

	return <div className={s.body}>
		<div className={s.bar}>
			<div className={s.hunter} style={{ flexGrow: hunterNorm }}></div>
			<div className={s.warlock} style={{ flexGrow: warlockNorm }}></div>
			<div className={s.titan} style={{ flexGrow: titanNorm }}></div>
		</div>
	</div>;
}

export default ClassDistribution;

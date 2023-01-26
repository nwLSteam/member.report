import { DiagramData } from "../components/SmallDiagram";
import API from "./API";

let data = {
	getPossibleClans: function ( name: string ) {
		return API.requests.Destiny2.GroupSearch( { name: name } )
			.then( r => console.log( r ) )
			.catch( e => console.log( e.message ) );
	},
};

export function randomValues(): DiagramData {
	let data = [];

	for ( let i = 0; i < 5; i++ ) {
		data.push( {
			           x: Math.random(),
			           y: Math.random(),
		           } );
	}

	return data;
}

export default data;

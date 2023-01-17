import API from "./API";

let data = {
	getPossibleClans: function ( name: string ) {
		return API.requests.Destiny2.GroupSearch( { name: name } )
			.then( r => console.log( r ) )
			.catch( e => console.log( e.message ) );
	},
};

export default data;
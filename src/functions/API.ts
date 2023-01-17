let api_key: string;

let API = {
	make_call: function ( url: string, method: string = "GET", data: any = null ): Promise<any> {
		return new Promise<any>(
			function ( resolve, reject ) {
				const request = new XMLHttpRequest();
				request.onload = function () {
					if ( this.status === 200 ) {
						resolve( this.response );
					} else {
						reject( new Error( this.statusText ) );
					}
				};
				request.onerror = function () {
					reject( new Error( "XMLHttpRequest Error: " + this.statusText ) );
				};
				request.open( method, url );
				request.setRequestHeader( "X-API-Key", api_key );
				if ( data === null ) {
					request.send();
				} else {
					request.send( JSON.stringify( data ) );
				}
			} );
	},

	set_key: function ( key: string ) {
		api_key = key;
	},

	requests: {
		Destiny2: {
			GroupSearch: function ( data: object ) {
				// this makes sure we're querying clans, not Bungie groups
				data = Object.assign( { groupType: 1 }, data );

				return API.make_call(
					`https://www.bungie.net/platform/GroupV2/Search/`,
					"POST",
					data,
				);
			},

			SearchDestinyPlayerByBungieName: function ( name: string, denominator: string ) {
				let data = {
					displayName: name,
					displayNameCode: denominator,
				};

				return API.make_call(
					`https://www.bungie.net/platform/Destiny2/SearchDestinyPlayerByBungieName/-1/ `,
					"POST",
					data,
				);
			},

			Stats: function ( membershipType: string, membershipId: string ) {
				return API.make_call(
					`https://www.bungie.net/platform/Destiny2/${membershipType}/Account/${membershipId}/Stats/`,
				);
			},
		},

		GroupV2: {
			GetGroupsForMember: function ( membershipId: string, membershipType: string ) {
				return API.make_call(
					`https://www.bungie.net/platform/GroupV2/User/${membershipType}/${membershipId}/0/1/`,
				);
			},

			GetMembersOfGroup: function ( groupId: string ) {
				return API.make_call(
					`https://www.bungie.net/platform/GroupV2/${groupId}/Members/`,
				);
			},

			GetGroup: function ( groupId: string ): Promise<any> {
				return API.make_call(
					`https://www.bungie.net/platform/GroupV2/${groupId}/`,
				);
			},
		},

		User: {
			SearchByGlobalNamePost: function ( name: string, page: number = 0 ) {
				let data = { displayNamePrefix: name };

				return API.make_call(
					`https://www.bungie.net/platform/User/Search/GlobalName/${page}/`,
					"POST",
					data,
				);
			},
		},
	},
};

export default API;
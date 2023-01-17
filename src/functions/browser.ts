import { FormEvent } from "react";

let browser = {
	setURL: function ( e: FormEvent, id: string ) {
		e.preventDefault();
		window.history.pushState( null, "", `?id=${id}` );
	},
};

export default browser;
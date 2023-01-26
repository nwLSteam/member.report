import React, { useState } from "react";
import navStyle from "./Nav.module.scss";

function Nav( props: React.PropsWithChildren<{}> ) {
	let [ closed, setClosed ] = useState<boolean>( false );

	return <nav className="App__nav">
		{!closed && props.children}
		<button className={closed ? navStyle.open : navStyle.close} onClick={() => setClosed( ( prev ) => !prev )}>
			{closed ? "Open ▼" : "Close ▲" }
		</button>
	</nav>;
}

export default Nav;

import React from "react";

function Nav( props: React.PropsWithChildren<{}> ) {
	return <nav className="App__nav">
		{props.children}
	</nav>;
}

export default Nav;

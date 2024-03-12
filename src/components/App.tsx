import React from "react";
import "./App.scss";
import Logo from "src/components/nav/Logo";
import ClanSearch from "./nav/ClanSearch";
import Credits from "./Credits";
import Nav from "./nav/Nav";

function App() {
	return (
		<div className="App">
			<Nav>
				<Logo />
				<ClanSearch />
				<Credits />
			</Nav>
			<main>

			</main>
		</div>
	);
}

export default App;

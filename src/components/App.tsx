import { ServerResponse } from "bungie-api-ts/destiny2";
import { GroupResponse, SearchResultOfGroupMember } from "bungie-api-ts/groupv2";
import React, { useEffect, useState } from "react";
import "./App.scss";
import ClanSearch from "./nav/ClanSearch";
import Details from "./Details";
import API from "../functions/API";
import Credits from "./Credits";
import Nav from "./nav/Nav";




function App() {
	return (
		<div className="App">
			<Nav>
				<h1>Destiny Member Report</h1>
				<ClanSearch />
				<Credits />
			</Nav>
			<main>

			</main>
		</div>
	);
}

export default App;

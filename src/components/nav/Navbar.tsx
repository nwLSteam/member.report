import React, { useState } from "react";
import ClanSearch from "src/components/nav/ClanSearch";
import Logo from "src/components/nav/Logo";
import s from "./Navbar.module.scss";
import searchIcon from "./search.svg";

function Navbar() {
	const [ searchVisible, setSearchVisible ] = useState( false );

	React.useEffect( () => {
		document.body.addEventListener( "click", ( e ) => {
			setSearchVisible( false );
		} );
	}, [] );

	return <div className={s.root}>
		<Logo />
		<button className={s.searchbutton}
		        onClick={( e ) => {
			        setSearchVisible( true );
			        e.stopPropagation();
		        }}>
			<img src={searchIcon} alt="Search icon" />
			<span className={s.searchstring}>Search</span>
		</button>
		<div className={`${s.search} ${searchVisible ? "" : s.hidden}`}>
			<ClanSearch />
		</div>
	</div>;
}

export default Navbar;

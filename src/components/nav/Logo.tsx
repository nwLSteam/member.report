import React from "react";
import { Link } from "react-router-dom";
import s from "./Logo.module.scss";

function Logo() {
	return <Link to={"/"} className={s.title}>
		<img src="/favicons/android-chrome-192x192.png" alt="Member Report Logo" />
		<span>Member Report</span>
	</Link>;
}

export default Logo;

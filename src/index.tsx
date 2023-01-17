import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./functions/reportWebVitals";
import API from "./functions/API";

function render() {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById( "root" ),
	);

}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	API.set_key( "e63836d14e1849a29b205bb62ef41337" );
} else {
	API.set_key( "1701fde013e0448abfbb74f9d24f5b63" );
}


render();
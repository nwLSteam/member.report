import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DetailsPage from "src/routes/DetailsPage";
import ErrorPage from "src/routes/ErrorPage";
import Frontpage from "src/routes/Frontpage";
import API from "./functions/API";


function render() {
	const router = createBrowserRouter(
		[
			{
				path: "/",
				element: <Frontpage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "clan/:id",
				element: <DetailsPage />,
				errorElement: <ErrorPage />,
			},
		],
	);

	ReactDOM.render(
		<RouterProvider router={router} />,
		document.getElementById( "root" ),
	);
}

if ( !process.env.NODE_ENV || process.env.NODE_ENV === "development" ) {
	API.set_key( "e63836d14e1849a29b205bb62ef41337" );
} else {
	API.set_key( "1701fde013e0448abfbb74f9d24f5b63" );
}


render();

import React from "react";
import { Link } from "react-router-dom";

interface DropdownElementProps {
	username: string;
	subtitle: any;
	active: boolean;
	to?: string;
}

export default class DropdownElement extends React.Component<DropdownElementProps> {
	render() {
		if ( this.props.active && this.props.to ) {
			return (
				<Link className="Dropdown__element"
				      to={this.props.to}>
					<span className="Dropdown__name">{this.props.username}</span>
					<span className="Dropdown__motto">{this.props.subtitle}</span>
				</Link>
			);
		}

		return (
			<button className="Dropdown__element Dropdown__element--inactive">
				<span className="Dropdown__name">{this.props.username}</span>
				<span className="Dropdown__motto">{this.props.subtitle}</span>
			</button>
		);
	}
}

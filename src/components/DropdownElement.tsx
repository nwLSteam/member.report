import React from "react";

interface DropdownElementProps {
	username: string;
	subtitle: any;
	active: boolean;
	callback?: ( e: any ) => void;
}

export default class DropdownElement extends React.Component<DropdownElementProps> {
	render() {
		if ( this.props.active ) {
			return (
				<div className="Dropdown__element"
				     onClick={this.props.callback ?? ( () => {} )}>
					<span className="Dropdown__name">{this.props.username}</span>
					<span className="Dropdown__motto">{this.props.subtitle}</span>
				</div>
			);
		}

		return (
			<div className="Dropdown__element Dropdown__element--inactive">
				<span className="Dropdown__name">{this.props.username}</span>
				<span className="Dropdown__motto">{this.props.subtitle}</span>
			</div>
		);
	}
}
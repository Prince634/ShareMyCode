import React from 'react'

class Header extends React.Component {

	navigateTo(page){
		this.props.history.push(`/${page}`)
	}

	render(){
		return(
			<div className="header">
				<div className="left-nav">
					<span className="nrby-txt" onClick={this.navigateTo.bind(this, '')}>ShareMyCode</span>
				</div>
				{/*<div className="right-nav">
					<span className="right-spn" onClick={this.navigateTo.bind(this, '')}>Home</span>
					<span className="right-spn" onClick={this.navigateTo.bind(this, 'login')}>Login</span>
				</div>*/}
				{
					this.props.loader?
					<p>Loading......</p>
					:''
				}
			</div>
			)
	}
}

export default Header
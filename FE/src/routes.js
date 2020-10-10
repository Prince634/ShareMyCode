import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeView from './Components/HomeView.js'
import EditView from './Components/ShareCodeView.js'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/shareCode/:roomId', component: EditView },
]

class Routes extends React.Component{

	static ROUTES = routes
	
	render(){

		return(
			<Switch>
				{
					routes.map((route, i)=>{
						return <Route key={i} exact path ={route.path} component={route.component} />
					})
				}
			</Switch>
			)
	}
}
export default Routes
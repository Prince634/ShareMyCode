import React from 'react'
import Header from './header.js'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'


function ShareCode(props){


	let roomId = props.match.params.roomId
	let GET_ROOM_CONTENT = gql`
	query GetRoom($roomId: String!){
			
			getRoom(roomId:$roomId){
				roomId
				users
				content
			}
	}
	`
	let { data } = useQuery(GET_ROOM_CONTENT, {variables: {roomId}})
	console.log(data);

	return(
		<React.Fragment>
			<Header {...props}/>
			<p>ShareCode</p>

			<textarea className="edit-blck" rows="50" value={data && data.getRoom && data.getRoom.content?data.getRoom.content:''} />
		</React.Fragment>
	)
}







class ShareCodeView extends React.Component{
//this.props.match.params.roomId
	constructor(props) {
		super(props)
		this.state = {
			selectedRoom: this.props.match.params.roomId,
			content: ''
		}
	}
	
	dataChange = (e)=>{

	}

	render(){

		let roomId = this.state.selectedRoom
		let GET_ROOM_CONTENT = gql`
		query GetRoom($roomId: String!){
				
				getRoom(roomId:$roomId){
					roomId
					users
					content
				}
				launchDemo{
					name
					mainUser @client
				}
		}
		`


		return(
			<React.Fragment>
				<Header {...this.props}/>
				<p>ShareCode Class Component</p>
				<Query query={GET_ROOM_CONTENT} variables={{roomId}} fetchPolicy='network-only'>
					{
						({error, data})=>{
							console.log('Data is', data)
							return <textarea className="edit-blck" rows="50" value={data && data.getRoom && data.getRoom.content?data.getRoom.content:this.state.content} onChange={(e)=>this.dataChange(e)}/>
						}
					}
				</Query>


			</React.Fragment>
		)

	}
	
		
}

export default ShareCodeView



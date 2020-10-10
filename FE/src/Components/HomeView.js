import React from 'react'
import Header from './header.js'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'


let GET_ALL_ROOMS = gql`{

	getAllRooms{
	    roomId
	    content
	    users
	}
}`

class HomeView extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			roomId: '11',
			name:'',
			content:''
		}
	}

	componentDidMount(){

	}

	createUUID(uid_string) {
	    var dt = new Date().getTime();
	    var uuid = uid_string.replace(/[xy]/g, function (c) {
	        var r = (dt + Math.random() * 16) % 16 | 0;
	        dt = Math.floor(dt / 16);
	        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	    });
	    return uuid;
	}

	getRoomId() {
	    let uid_string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxyyyxxxxxx'
	    let roomId = this.createUUID(uid_string);
	    return roomId;
	}

	createMeeting = (roomId)=>{
		
		if(roomId){

		}else{
			roomId = this.getRoomId()
		}
		
		this.props.history.push(`/shareCode/${roomId}`)
	}

	roomChange = (e)=>{
		this.setState({roomId: e.target.value})
	}

	inputHandler = (e)=>{
		this.setState({[e.target.name]: e.target.value})
	}

	updateUsers = (store, roomMembers) =>{
		let cache = store.readQuery({query: GET_ALL_ROOMS});
		let new_data = cache.getAllRooms.filter((x)=>{
			if(x.roomId==this.state.roomId) {
				x.users= roomMembers.users;
				return x;
			}
			return x;
		}) 
		let data = {
			getAllRooms: new_data
		}
		console.log(cache);
		console.log(data);
		try{
			store.writeData({query: GET_ALL_ROOMS, data })	
		}catch(e){
			console.log(e);
		}
		
	}

	_subscribeToRooms = (subscribeToMore)=>{
		let NEW_ROOM_SUBS = gql`
			subscription{
				newRoomContent{
					roomId
					users
					content
				}
			}
		`
		subscribeToMore({
			document: NEW_ROOM_SUBS,
			updateQuery:(prev, {subscriptionData}) => {
				console.log('Prev is', prev);
				console.log('New is ', subscriptionData);
				return {getAllRooms:subscriptionData.data.newRoomContent};
			}
		})
	}

	render(){

		let GET_ROOM_CONTENT = gql`

			query GetRoomContent($roomId: String!){
				getRoom(roomId:$roomId){
					roomId
					users
					content
				}
			}
		`

		let ADD_NEW_USER = gql`
			mutation AddNewUser($roomId: String!, $name: String!, $content: String!){
				addRoomMembers(roomId:$roomId, name:$name, content: $content) {
				    users
				    content
				    roomId
				}
			}
			`

		let client_query = gql`{
			adminUser @client
		}`

		let { roomId, name, content}  = this.state

		return(
			<div className="homeView">
				<Header {...this.props} />
				<h2>ALL Available Rooms</h2>
				<div className="allRooms">
					<Query query={client_query}>
						{
							({data})=>{
								console.log(data);
								return <p>Prince</p>
							}
						}
					</Query>
					<Query query={GET_ALL_ROOMS} >
						{
							({loading, error, data, subscribeToMore})=>{

								if(loading) return <p>loading</p>
								if(loading) return <p>loading</p>
								let rooms = data.getAllRooms
								this._subscribeToRooms(subscribeToMore);
								return (
									<React.Fragment>
										{
											rooms.map((room)=>{
												return(<div className="room" key={room.roomId}>
													<p className="room-spec">{`Room Id : ${room.roomId}`}</p>
													<p className="room-spec">Room Members:</p>
													{
														room.users && room.users.length?
														<ul>
														{
															room.users.map((user, key)=>{
																return <li key={key}>{user}</li>
															})
														}
														</ul>
														:<p>No Users </p>
													}
													<p>Enter Name</p>
													<input type="text" onChange={(e)=>this.inputHandler(e)} value={this.state.name} name="name"/>
													<p>Enter Content</p>
													<input type="text" onChange={(e)=>this.inputHandler(e)} value={this.state.content} name="content"/>
													
													<Mutation mutation={ADD_NEW_USER} variables={{roomId, name, content}} update={(store, {data:{addRoomMembers}})=>this.updateUsers(store, addRoomMembers)}>
													{
														(postMutation)=>{
															return <button onClick={postMutation}>Add New User</button>
														}
													}
													</Mutation>
													<button onClick={()=>this.createMeeting(room.roomId)}>View Meeting</button>
												</div>)
											})
										}

										{
											<select id="rooms_ids" onChange={(e)=>this.roomChange(e)}>
												{
													rooms.map((room)=>{
														return (<option key={room.roomId} value={room.roomId}>{room.roomId}</option>)
													})
												}
											</select>
										}
									</React.Fragment>
									)
							}
						}
					</Query>
				</div>
				<p>Room Content</p>
				<Query query={GET_ROOM_CONTENT} variables={{roomId}}>
					{
						({loading, error, data})=>{
							if(loading) return<p>Loading....</p>
							if(data && data.getRoom) {
								return <p>{data.getRoom.content}</p>
							}else{
								return ''
							}
						}
					}

				</Query>

				<button onClick={()=>this.createMeeting()}>Create New Meeting</button>
			</div>
		)
	}
}

export default HomeView
import { GraphQLServer, PubSub } from 'graphql-yoga';
import prisma from './prisma';

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const pubsub = new PubSub();
var Users = [
	{name:'First', email: 'I m the 1st' }
];

var Rooms = [
	{roomId:'11', users: [], content: ''}
]
const typeDefs = `
	type Query{
		getAllUsers: [User!]!
		getAllRooms: [Room!]!
		getRoom(roomId: String!): Room!
		user(name: String!): User!
		launchDemo: Demo!
	}

	type Mutation{
		createUser(name: String!, email: String!): User!
		createRoom(roomId: String!): Room!
		addRoomMembers(roomId: String!, name: String, content: String):Room!
	}

	type Demo{
		name: String!
	}

	type Subscription{
		newRoomContent: [Room!]!
	}

	type User {
	  name: String!
	  email: String!
	}

	type Room{
		roomId: String!,
		users: [String!]!
		content: String
	}
	`

const resolvers = {
	Query: {
		getAllUsers(){
			return Users
		},
		getAllRooms(){
			return Rooms
		},
		user(parent, args){
			let user = Users.filter(x=>x.name==args.name)
			if(user && user.length) {
				return user[0]
			}
			throw new Error('No User Found');
		},
		getRoom(parent, args){
			let room = Rooms.filter(x=>x.roomId==args.roomId)
			if(room && room.length) {
				return room[0]
			}
			throw new Error('No Room Found');
		},
		launchDemo(parent, args){
			return {name: "Hey Prince"}
		}

	},

	Mutation: {
		createUser(parent, args){
			let newUser = {name: args.name, email: args.email}
			Users.push(newUser);
			return newUser
		},
		createRoom(parent, args) {
			let newRoom = {roomId: args.roomId, content:'', users:[]}
			Rooms.push(newRoom);
			return newRoom
		},
		addRoomMembers(parent, args, {pubsub}) {
			let rooms = Rooms.filter(x=>x.roomId== args.roomId);
			let otheRooms = Rooms.filter(x=>x.roomId != args.roomId);

			if(rooms && rooms.length) {

				if(args.name) {
					rooms[0].users.push(args.name);
				}
				if (args.content){
					rooms[0].content = args.content;
				}
				Rooms = rooms.concat(otheRooms);
				pubsub.publish('roomChange',{
					newRoomContent:Rooms
				})
				return rooms[0];

			}

			throw new Error('No room exist');

		}

	},

	Subscription:{
		newRoomContent:{
			subscribe(parent, args, {pubsub}) {
				return pubsub.asyncIterator('roomChange');
			}
		}
	}
}

const server = new GraphQLServer({
	typeDefs,
	resolvers,
	context(request){
		return{
			request,
			pubsub
		}
	}
})

server.start('4009',()=>{
	console.log('Server starts at 4009');
})
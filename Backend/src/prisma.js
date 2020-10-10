import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs:'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4468',
	secret: 'thisismysuperAdmin'
})


export default prisma
// prisma.query.users(null, '{ id name email posts{ id title } }').then((resp)=>{
// 	console.log(JSON.stringify(resp, undefined, 2));
// })

const createUser = async (data)=>{

	const user = await prisma.mutation.createUser({
		data:data
	}, '{ name email }');

	console.log('User crated is ', user);
}


const getAllUsers = async ()=>{

	const getAllUsers = await prisma.query.users(null, '{id name email posts { id title} }')
	console.log('List of all Users', JSON.stringify(getAllUsers, undefined, 2));
}

// let usrData = {
// 			name: 'Parteek',
// 			email: 'pt.com'
// 		}
// createUser(usrData);


const addComment = async (data, postId)=> {
	var comment;
	try{
		comment = await prisma.mutation.createComment({ 
			data: {
				text: data,
				author: {
					create:{
						name: 'Mayank',
						email:'m.com'
					}
				},
				post:{
					connect:{
						id: postId
					}
				}
			}
		}, '{id text author{ id name } post { id title body } }')

			console.log('Comment is ', JSON.stringify(comment));
			

	}catch(e){
		console.log(e);
	}
	
}




//addComment('Hey I m query comment', 'ck8r1xh3900m90855hce2z9u5');

//getAllUsers();


const getAllComments = async ()=>{
	const comments = await prisma.query.comments(null, '{ id text author{ id name } post { id body title }}')
	console.log('All Comments are', JSON.stringify(comments, undefined, 5));
}

//getAllComments();





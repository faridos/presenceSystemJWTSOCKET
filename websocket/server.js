let io = require('socket.io')(3000)
let jwt = require('jsonwebtoken')

let users= []
let golbal_currentUser={}
io.on('connection',socket => {

    console.log('un user est connecté');
    socket.on('identify',({token})=>{
    try {
        let decoded= jwt.verify(token,'demo',{
            alogrithms: ['HS256']
        })

        let currentUser={
            id: decoded.user_id,
            name: decoded.user_name,
            count: 1
        }
        golbal_currentUser=currentUser
        let user = users.find(u=>u.id===currentUser.id)
        if(user){
          user.count++
        }
        else{
            users.push(currentUser)
            socket.broadcast.emit('users.new',{user:currentUser})

        }
        socket.emit('users',{users})
        }
        catch(e){
            console.log(e.message)
        }
    })
    socket.on('disconnect',()=>{
        let user = users.find(u=>u.id===golbal_currentUser.id)
        if(user){

            user.count--
            if(user.count==0){
                users = users.filter(u=>u.id !== golbal_currentUser.id)
                socket.broadcast.emit('users.leave',{user:golbal_currentUser})
            }

        }
    })

    })
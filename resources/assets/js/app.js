require('./bootstrap');

import io from 'socket.io-client'

let socket= io('http://localhost:3000')

let presence = document.querySelector('#presence')

let addUser = (user)=>{
    let li= document.createElement('li')
    li.innerText= user.name
li.id="user"+user.id
presence.appendChild(li)
}
if(presence){
    socket.on('connect', ()=>{
        socket.emit('identify',{
            token: presence.dataset.token
        })

    })


    socket.on('users.new',({user})=>addUser(user))
    socket.on('users',({users})=>{
      for (let k in users){
          addUser(users[k])
      }
    })
    socket.on('users.leave',({user})=>{
      presence.removeChild(document.querySelector('#user'+user.id))
    })
}

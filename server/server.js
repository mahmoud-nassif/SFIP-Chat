const express=require('express')
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const socket=require('socket.io')

const app=express();
app.use(bodyParser.json());
const mongoClient=mongodb.MongoClient;

app.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin','http://localhost:4200')
    res.append('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
    res.append('Access-Control-Allow-Headers','Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
    res.append('Access-Control-Allow-Credentials',true)
    next()
})

mongoClient.connect('mongodb://localhost:27017/mychat',(err,database)=>{
    if(err) {
        console.log(err);
        return false;
    }
    console.log("connected to chat database")
    const db=database.db('chat')
    users=db.collection("users")
    chatRooms=db.collection("chatRooms")
    const server=app.listen(3000,()=>{
        console.log("server listening")
    })
    const io=socket.listen(server)
    
    io.on('connection',(socket)=>{
        socket.on('join',(data)=>{
            socket.join(data.room)
            chatRooms.find({}).toArray((err,roomsArray)=>{
                if(err)
                {
                    console.log(err)
                    return false;
                }
                let count=0;
                roomsArray.forEach(room=>{
                    if(room.name==data.room)
                    {
                        count++
                    }
                })
                if(count==0)
                {
            
                    chatRooms.insertOne({name:data.room,messages:[]})
                    socket.emit('roomjoined',data.room)
                    
                }
               
            })
        })
        socket.on('message',(data)=>{

          chatRooms.update({name:data.room},{$push:{messages:{user:data.currentUser,message:data.message}}})
          io.in(data.room).emit('new message',{user:data.currentUser,message:data.message})
        })

        socket.on('typing',(data)=>{
            console.log('typing data',data)
            socket.broadcast.in(data.room).emit('typing',{data:data,istyping:true})
        })
    })
})

app.get('/', (req, res, next) => {
    res.send('Welcome to the express server...');
});

app.post("/api/users",(req,res)=>{
    let user={username:req.body.username,
        email:req.body.email,
        password:req.body.password}

    let count=0;
    users.find({}).toArray((err,usersArray)=>{
        if(err)
        {
            console.log(err)
            res.status(500).send(err)
        }
        for(let i=0;i<usersArray.length;i++)
        {
            if(usersArray[i].username==user.username)
            count++;
        }
        if(count==0)
        {
            users.insertOne(user,(err,user)=>{
                if(err)
                {
                  res.send(err)
                }
                res.json(user)
            })
        }
        else{
            
            res.json({user_already_signed_up:true})
        }
        
    })
    
})

app.post("/api/login",(req,res)=>{
    let isPresent=false;
    let correctPassword=false;
    let loggedInUser;

    users.find({}).toArray((err,usersArray)=>{
        if(err)res.send(err);
        usersArray.forEach((user)=>{
            if(user.username==req.body.username){
                if(user.password==req.body.password){
                    isPresent=true;
                    correctPassword=true;
                    loggedInUser={
                        username:req.body.username,
                        password:req.body.password
                    }
                }
                else{
                    isPresent=true;
                }
            }
        })
        res.json({isPresent:isPresent,correctPassword:correctPassword,user:loggedInUser})

    })
})

app.get('/api/users',(req,res)=>{
    users.find({},{username:1,email:1,_id:0}).toArray((err,usersArray)=>{
        if(err)
          res.send(err)
        res.json(usersArray)
    })
})

app.get('/api/chatroom/:chatroom',(req,res)=>{

    let chatroom=req.params.chatroom;
    chatRooms.find({name:chatroom}).toArray((err,chatroom)=>{
        if(err)
        {
            console.log(err);
            return false;
        }
        if(chatroom[0])
        res.json(chatroom[0].messages)
        else 
        return res.json([]);
    })
})
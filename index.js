const http=require('http');
const environmentExport=require('./helpers/environments');

const {handleserver}=require('./helpers/handleReq')
const data=require('./lib/data');


const app={} //this object for scaffolding

// app.config={    
//     port:3000
// }

// testing file system
// data.create('test','newfile1',{name:'Bangladesh',language:'Bangla'},(err)=>{
//     console.log("error was "+err);
// })

// data.read('test','newfile',(err,data)=>{
//     console.log(err,data);
// })

// data.update('test','newfile1',{name:'Bangladesh',language:'English'},(err)=>{
//     console.log(err);
// })
// data.read('test','newfile1',(err,data)=>{
//     console.log(err,data);
// })

// data.delete('test','newfile1',(err)=>{
//     console.log(err);
// })


//creating a server 
app.createServer=()=>{
    const server=http.createServer(app.handleserver);

    server.listen(environmentExport.port,()=>{
        // console.log(`Environment variable is ${process.env.NODE_ENV}`); //Environment variable running command "NODE_ENV=production nodemon index.js"
        console.log(`Listening to port ${environmentExport.port}`)
    })
}
//handle the server
app.handleserver=handleserver;

app.createServer(); //call the create server function
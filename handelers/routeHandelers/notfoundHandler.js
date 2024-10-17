

const handler={} //module scaffolding

handler.notfoundHandler=(requestProperties,callBack)=>{
    // console.log(requestProperties);
    callBack(404,{
        messege:"Your request url not found",
    })
    
}
module.exports=handler;
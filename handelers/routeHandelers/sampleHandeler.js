

const handler={} //module scaffolding

handler.sampleHandeler=(requestProperties, callBack)=>{
    console.log(requestProperties);
    callBack(200,{
        message:"This is sample url"});
}
module.exports=handler;
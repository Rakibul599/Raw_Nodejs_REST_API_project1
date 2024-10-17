// dependencies
const {sampleHandeler}=require('./handelers/routeHandelers/sampleHandeler')
const {userHandler}=require('./handelers/routeHandelers/userHandler');
const {tokenHandler}=require('./handelers/routeHandelers/tokenHandler');
const {cheackHandler}=require('./handelers/routeHandelers/cheackHandler');

const route={
    'sample':sampleHandeler,
    'user':userHandler,
    'tokens':tokenHandler,
    'cheack':cheackHandler
}
module.exports=route;
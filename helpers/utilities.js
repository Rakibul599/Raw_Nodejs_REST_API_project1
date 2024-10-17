
// Dependencies
const crypto=require('crypto');
const environments=require('./environments');

const utilities={}
// parse JSON string to object
utilities.parseJSON=(jsonString)=>{
    let output;
    try{
        output=JSON.parse(jsonString);
    }
    catch(error){
        // console.log(error)
        output={};
    }
    return output;
}
utilities.hash=(str)=>{
    if(typeof(str)==='string' && str.length>0)
        {
           let hash= crypto.createHmac('sha256', environments.secreat_key)
            .update(str)
            .digest('hex')
            return hash;
        }
        else return false;
}

utilities.createRandomString=(strLen)=>{

    let possibleChar='abcdefghijklmnopqrstuvwxyz1234567890';
    let output='';
    for(let i=0;i<strLen;i++)
        {
            output+=possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
        }
        return output;
}

module.exports=utilities
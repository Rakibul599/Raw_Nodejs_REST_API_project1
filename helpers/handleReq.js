const url=require('url');
const {StringDecoder}=require('string_decoder');
const route=require('../routes');
const {notfoundHandler}=require('../handelers/routeHandelers/notfoundHandler');
const {parseJSON}=require('../helpers/utilities')


const handeler={}; //module scaffolding

handeler.handleserver=(req,res)=>{ 
    const parseUrl=url.parse(req.url,true); //parse url object
    const pathname=parseUrl.pathname;
    const trimPath = pathname.replace(/^\/+|\/+$/g, ''); //using regular expression to remove unwanted slash 
    const method=req.method.toLowerCase();
    const query=parseUrl.query; //receiving quey object from url'
    const headerobject=req.headers;
    const decoder=new StringDecoder(); 
    let realData='';
    let requestProperties={
        parseUrl,
        pathname,
        trimPath,
        method,
        query,
        headerobject,
    };
   
    const chosenHandler=route[trimPath] ? route[trimPath] : notfoundHandler;


    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
    })
    req.on('end',()=>{
        realData+=decoder.end();
        
        requestProperties.body=parseJSON(realData);
  
        chosenHandler(requestProperties, (stutusCode,payload)=>{
            stutusCode=typeof(stutusCode)==='number' ? stutusCode :500;
            payload=typeof(payload)==='object' ? payload : {};
    
            const payloadString=JSON.stringify(payload);
            res.setHeader('content-type','application/json');
            res.writeHead(stutusCode);
            res.end(payloadString);
    
        });
        // res.end('Hello world'); //server response this message
    })
}
module.exports=handeler;
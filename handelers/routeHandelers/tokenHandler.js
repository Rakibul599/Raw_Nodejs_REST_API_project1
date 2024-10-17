// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
const utilities = require("../../helpers/utilities");

const handler = {}; //module scaffolding

handler.tokenHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};
handler._token = {};
handler._token.post = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("user", phone, (err, userData) => {
      let hashPassword = hash(password);
      if (hashPassword === parseJSON(userData).password) {
        let tokenId = utilities.createRandomString(20);
        let expire = Date.now() + 60 * 60 * 1000;

        let tokenObject = {
          phone,
          id: tokenId,
          expire,
        };

        // Store the database
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callBack(200, tokenObject);
          } else {
            callBack(500, { msg: "Problem in server side" });
          }
        });
      } else {
        callBack(400, { eror: "Password is not valid" });
      }
    });
  } else {
    callBack(400, "You have a problem in your request");
  }
};
handler._token.get = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.query.id === "string" &&
    requestProperties.query.id.trim().length === 20
      ? requestProperties.query.id
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        let token = { ...parseJSON(tokenData) };

        callBack(200, token);
      } else callBack(403, { error: "token not find" });
    });
  } else callBack(403, { error: "token not find" });
};
handler._token.put = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

      if(id && extend)
        {
          data.read('tokens',id,(err,tokenData)=>{
            
            if(!err && tokenData)
              {
                let objToken=parseJSON(tokenData);
                if(objToken.expire > Date.now())
                  {
                    objToken.expire=Date.now() + 60*60*1000;
                    // update the token
                    data.update('tokens',id,objToken,(err)=>{
                      if(!err)
                        {
                          callBack(200,{msg:"token is updated"})
                        } 
                        else callBack(500, {Msg:"there was a server side problem"});
                    })

                  }
                  else callBack(400, {Msg:"Your token is expired"});



              }
              else callBack(400, {Msg:"You have a problem in your request2"});

          })


        }
        else callBack(400, {Msg:"You have a problem in your request1"});
};
handler._token.delete = (requestProperties, callBack) => {
  const id =
  typeof requestProperties.query.id === "string" &&
  requestProperties.query.id.trim().length === 20
    ? requestProperties.query.id
    : false;

    if(id)
      {
        data.read('tokens',id,(err,tokenData)=>{
          if(!err)
            {
              data.delete('tokens',id,(err)=>{
                if(!err)
                  {
                    callBack(200,{"msg":"Token delete successfully"});
                  }
                  else callBack(500,{msg:"server problem"});
              })
            }
            else callBack(400,{msg:"bad request"});
        })
      }
      else callBack(400,{msg:"bad request"});
};
handler._token.verify=(id,phone,callBack)=>
{
  data.read('tokens',id,(err,tokenData)=>{
    if(!err && tokenData)
      {
        if(parseJSON(tokenData).phone===phone && parseJSON(tokenData).expire > Date.now())
          {
            callBack(true);
          }
          else callBack(false);
      }
      else callBack(false);
  })
}

module.exports = handler;

// dependencies
const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

const handler = {}; //module scaffolding

handler.cheackHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._cheack[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

handler._cheack = {};
handler._cheack.post = (requestProperties, callBack) => {
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  let successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;
  let timeoutSecond =
    typeof requestProperties.body.timeoutSecond === "number" &&
    requestProperties.body.timeoutSecond % 1 === 0 &&
    requestProperties.body.timeoutSecond >= 1 &&
    requestProperties.body.timeoutSecond <= 5
      ? requestProperties.body.timeoutSecond
      : false;

  if (protocol && url && method && successCode && timeoutSecond) {
    let token =
      typeof requestProperties.headerobject.token === "string"
        ? requestProperties.headerobject.token
        : false;
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;
        data.read("user", userPhone, (err, userData) => {
          if (!err && userData) {
            _token.verify(token, userPhone, (tokenStutus) => {
              if (tokenStutus) {
                let userObj = parseJSON(userData);
                let userCheacks =
                  typeof userObj.check === "object" &&
                  userObj.check instanceof Array
                    ? userObj.check
                    : [];
                if (userCheacks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let cheackObject = {
                    id: checkId,
                    userPhone,
                    protocol: protocol,
                    url: url,
                    method: method,
                    successCode: successCode,
                    timeoutSecond: timeoutSecond,
                  };
                  data.create("checks", checkId, cheackObject, (err) => {
                    if (!err) {
                      userObj.checks = userCheacks;
                      userObj.checks.push(checkId);
                      //store the database
                      data.update("user", userPhone, userObj, (err) => {
                        if (!err) {
                          callBack(200, cheackObject);
                        } else
                          callBack(500, {
                            msg: "There was a server side problem",
                          });
                      });
                    } else {
                      callBack(500, { msg: "There was a server side problem" });
                    }
                  });
                } else callBack(401, { msg: "User has already max cheack" });
              } else callBack(403, { msg: "User Authenticate problem!" });
            });
          } else callBack(403, { msg: "User not found!" });
        });
      } else callBack(403, { msg: "User Authenticate problem!" });
    });
  } else callBack(400, { msg: "you have a error in your request1" });
};
handler._cheack.get = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.query.id === "string" &&
    requestProperties.query.id.trim().length === 20
      ? requestProperties.query.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      const newCheackdata=parseJSON(checkData);
      const userPhone=newCheackdata.userPhone;
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerobject.token === "string"
            ? requestProperties.headerobject.token
            : false;
            _token.verify(token,userPhone,(tokenstutus)=>{
              if(tokenstutus)
                {
                  callBack(403, newCheackdata);
                }
                else callBack(403, { msg: "User Authentication error" });
            })
      } else callBack(500, { msg: "there was a problem in server side!" });
    });
  } else callBack(400, { msg: "you have a error in your request1" });
};

handler._cheack.put = (requestProperties, callBack) => {};

handler._cheack.delete = (requestProperties, callBack) => {};

module.exports = handler;

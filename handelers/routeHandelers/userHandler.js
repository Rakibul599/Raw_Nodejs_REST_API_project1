// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");

const handler = {}; //module scaffolding

handler.userHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

handler._users = {};
handler._users.post = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  const tosAgrement =
    typeof requestProperties.body.tosAgrement === "boolean"
      ? requestProperties.body.tosAgrement
      : false;
  // console.log(firstName);
  // console.log(requestProperties.body);
  if (firstName && lastName && phone && password && tosAgrement) {
    data.read("user", phone, (err, user) => {
      if (err) {
        let userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgrement,
        };
        // store the user in db
        data.create("user", phone, userObj, (err) => {
          if (!err) {
            callBack(200, { msg: "user was created" });
          } else callBack(500, { error: "could not create user" });
        });
      } else {
        callBack(500, {
          error: "There was problem in server side",
        });
      }
    });
  } else {
    callBack(400, {
      error: "There was a problem on your request",
    });
  }
};
handler._users.get = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.query.phone === "string" &&
    requestProperties.query.phone.trim().length === 11
      ? requestProperties.query.phone
      : false;

  if (phone) {
    // Verify the token
    let token =
      typeof requestProperties.headerobject.token === "string"
        ? requestProperties.headerobject.token
        : false;

    _token.verify(token, phone, (tokenStutus) => {
      if (tokenStutus) {
        data.read("user", phone, (err, u) => {
          if (!err && u) {
            let user = { ...parseJSON(u) };
            delete user.password;
            callBack(200, user);
          } else callBack(403, { error: "user not find" });
        });
      } else {
        callBack(403, { error: "Authenticator failed!" });
      }
    });
  } else callBack(403, { error: "user not found" });
};

handler._users.put = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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

  if (phone) {
    // Verify the token
    let token =
      typeof requestProperties.headerobject.token === "string"
        ? requestProperties.headerobject.token
        : false;

    _token.verify(token, phone, (tokenStutus) => {
      if (tokenStutus) {
        data.read("user", phone, (err, userData) => {
          if (!err && userData) {
            let user = { ...parseJSON(userData) };
            if (firstName || lastName || password) {
              if (firstName) {
                user.firstName = firstName;
              }
              if (lastName) {
                user.lastName = lastName;
              }
              if (password) {
                user.password = hash(password);
              }

              // to store the database
              data.update("user", phone, user, (err) => {
                if (!err) {
                  callBack(200, {
                    msg: "Updated successfully",
                  });
                } else callBack(500, { msg: "Message your request is bad" });
              });
            } else callBack(400, { msg: "Message your request is bad" });
          } else callBack(400, { msg: "Message your request is bad" });
        });
      } else {
        callBack(403, { error: "Authenticator failed!" });
      }
    });
  } else callBack(400, { msg: "Message your request is bad" });
};
// @TODO Authentication
handler._users.delete = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.query.phone === "string" &&
    requestProperties.query.phone.trim().length === 11
      ? requestProperties.query.phone
      : false;

  if (phone) {
    // Verify the token
    let token =
      typeof requestProperties.headerobject.token === "string"
        ? requestProperties.headerobject.token
        : false;

    _token.verify(token, phone, (tokenStutus) => {
      if (tokenStutus) {
        data.read("user", phone, (err) => {
          if (!err) {
            data.delete("user", phone, (err) => {
              if (!err) {
                callBack(200, { msg: "user delete successfully" });
              } else callBack(500, { msg: "server problem" });
            });
          } else callBack(400, { msg: "bad request" });
        });
      } else {
        callBack(403, { error: "Authenticator failed!" });
      }
    });
  } else callBack(400, { msg: "bad request" });
};

module.exports = handler;

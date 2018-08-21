const utilsPassword = require('../utils/password');

const User = require('../models/users');

exports.getAccount = (req, res, next) => {
  const address = req.params.address;

  if (address) {
    const query = { address };

    User.findOne(query)
      .populate({
        path: 'company',
        populate: [
          { path: 'hermes' }
        ]
      })
      .then(user => {
        if (user) {
          req.status = 200;
          req.json = user;
          return next();
        } else {
          throw 'No user found';
        }
      })
      .catch(error => {
        req.status = 400;
        req.json = { message: error };
        return next();
      });
  } else if (!address) {
    req.status = 400;
    req.json = { message: '"address" is required' };
    return next();
  }
}

exports.getAccounts = (req, res, next) => {
  const company = req.params.company;

  if (company) {
    const query = { company };

    User.find(query)
      .then(users => {
        if (users) {
          req.status = 200;
          req.json = user;
          return next();
        } else {
          throw 'No user found';
        }
      })
      .catch(error => {
        req.status = 400;
        req.json = { message: error };
        return next();
      });
  } else if (!company) {
    req.status = 400;
    req.json = { message: '"company" is required' };
    return next();
  }

}

exports.getSettings = (req, res, next) => {

}

exports.getNotifications = (req, res, next) => {

}

exports.editInfo = (req, res, next) => {
  const email = req.body.email;
  const info = req.body;

  if(email) {
    User.findOne({ email })
      .then(user => {
        for (const key in info) {
          if (
            key === 'full_name' ||
            key === 'company' ||
            key === 'address' ||
            key === 'role' ||
            key === 'active' ||
            key === 'settings'
          ) {
            user[key] = info[key]
          }
        }
        user
          .save()
          .then(saved => {
            req.status = 200;
            req.json = { message: 'Update data successfull' };
            return next();
          })
          .catch(error => {
            req.status = 400;
            req.json = { message: 'Update data failed' };
            return next();
          });
      })
      .catch(error => {
        req.status = 400;
        req.json = { message: '"email" is required' };
        return next();
      })
  }

}

exports.changePassword = (req, res, next) => {
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (email && oldPassword && newPassword) {
    User.findOne({ email })
      .then(user => {
        if (user) {
          const [address, secret] = utilsPassword.decrypt(user.token, oldPassword).split('|||');

          if (address && secret) {
            user.token = utilsPassword.encrypt(`${address}|||${secret}`, newPassword);

            user
              .save()
              .then(saved => {
                req.status = 200;
                req.json = { message: 'Reset password success' };
                return next();
              })
              .catch(error => {
                req.status = 400;
                req.json = { message: 'Reset password failed' };
                return next();
              });
          } else {
            req.status = 401;
            req.json = { message: '"password" is incorrect' };
            return next();
          }
        } else {
          throw 'No user found';
        }
      })
      .catch(error => {
        req.status = 400;
        req.json = { message: error };
        return next();
      });
  } else if (!email) {
    req.status = 400;
    req.json = { message: '"email" is required' };
    return next();
  } else if (!oldPassword) {
    req.status = 400;
    req.json = { message: '"oldPassword" is required' };
    return next();
  } else if (!newPassword) {
    req.status = 400;
    req.json = { message: '"newPassword" is required' };
    return next();
  }
};

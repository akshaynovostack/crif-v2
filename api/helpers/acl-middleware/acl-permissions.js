var acl = require('acl');
const nodeAcl = new acl(new acl.memoryBackend());

nodeAcl.addUserRoles('1', 'USR');//Users

nodeAcl.allow([
  {
    roles: ['USR'],
    allows: [
      {
        resources: [
          '/user/get'
        ],
        permissions: ['*']
      },
    ],
  },

]);

exports.nodeAcl = nodeAcl;
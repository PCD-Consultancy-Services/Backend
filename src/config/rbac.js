const SUPER_ADMIN = "SUPER_ADMIN";
const MANAGER = "MANAGER";
const USER = "USER";

const rbac = {
  roles: [
    {
      name: SUPER_ADMIN,
      // permissions: [
      //   "create_record",
      //   "read_record",
      //   "update_record",
      //   "delete_record",
      // ],
    },
    {
      name: MANAGER,
    },
    {
      name: USER,
    },
  ],
};

const roles = rbac.roles
  .map((role) => role.name)
  .filter((role) => role !== SUPER_ADMIN);

module.exports = {
  roles,
  SUPER_ADMIN,
  MANAGER,
  USER,
};

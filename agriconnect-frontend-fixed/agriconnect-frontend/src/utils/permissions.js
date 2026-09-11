export const ROLES = {
  ADMIN: "ADMIN",
  FARMER: "FARMER",
  BUYER: "BUYER",
};

export const hasRole = (
  user,
  role
) => {
  return (
    user?.role === role
  );
};

export const isAdmin =
  (user) =>
    hasRole(
      user,
      ROLES.ADMIN
    );

export const isFarmer =
  (user) =>
    hasRole(
      user,
      ROLES.FARMER
    );

export const isBuyer =
  (user) =>
    hasRole(
      user,
      ROLES.BUYER
    );

export const hasAnyRole =
  (user, roles) => {
    return roles.includes(
      user?.role
    );
  };
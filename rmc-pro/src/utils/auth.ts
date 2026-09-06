export type UserRole =
  | "admin"
  | "operator"
  | "accounting";

export interface LoggedInUser {
  id: number;
  username: string;
  role: UserRole;
}

/* ================================================= */
/* GET CURRENT USER                                  */
/* ================================================= */

export function getCurrentUser(): LoggedInUser | null {
  const userData = localStorage.getItem("rmc_user");

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as LoggedInUser;
  } catch {
    return null;
  }
}


/* ================================================= */
/* GET CURRENT ROLE                                  */
/* ================================================= */

export function getCurrentRole(): UserRole | null {
  const user = getCurrentUser();

  return user?.role ?? null;
}


/* ================================================= */
/* CHECK LOGIN                                       */
/* ================================================= */

export function isAuthenticated(): boolean {
  return Boolean(
    localStorage.getItem("rmc_token")
  );
}


/* ================================================= */
/* CHECK ROLE                                        */
/* ================================================= */

export function hasRole(
  ...allowedRoles: UserRole[]
): boolean {
  const role = getCurrentRole();

  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}


/* ================================================= */
/* LOGOUT                                            */
/* ================================================= */

export function logoutUser(): void {
  localStorage.removeItem("rmc_user");
  localStorage.removeItem("rmc_token");
}
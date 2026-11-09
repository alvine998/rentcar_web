export const ADMIN_SESSION_COOKIE = "admin_session";

export function setAdminSession() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=1;path=/;max-age=86400`;
}

export function clearAdminSession() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=;path=/;max-age=0`;
}

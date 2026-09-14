export const storage = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),

  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setRefreshToken: (refreshToken) => localStorage.setItem("refreshToken", refreshToken),
  removeRefreshToken: () => localStorage.removeItem("refreshToken"),

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),

  clear: () => localStorage.clear(),
};
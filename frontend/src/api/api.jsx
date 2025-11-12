import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // ✅ this line is required
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";
// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// // Add JWT token to headers automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.authorization = `Bearer ${token}`;
//     return config;
//   }
// });

// export default api;

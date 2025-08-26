import { AxiosRequestHeaders } from "axios";
// import { getServerSession } from "next-auth";
// import authOptions from "./auth";
import api from "./api";

const serverApi = api;
// serverApi.interceptors.request.use(
//   async (config) => {
//     const session = await getServerSession(authOptions);

//     const token = session?.user.accessToken || "";

//     config.headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//       "Content-Type": "application/x-www-form-urlencoded",
//     } as AxiosRequestHeaders;

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default serverApi;

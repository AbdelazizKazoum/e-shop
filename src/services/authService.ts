import axiosClient from "@/lib/axiosClient";

export const login = (data: { email: string; password: string }) => {
  return axiosClient.post("/auth/login", data);
};

export const register = (data: FormData) => {
  return axiosClient.post("/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const completeProfile = (data: FormData) => {
  return axiosClient.post("/auth/complete-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
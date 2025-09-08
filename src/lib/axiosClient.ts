"use client";

import { getSession } from "next-auth/react";
import api from "./api";

const axiosClient = api;

axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  console.log("🚀 ~ session:", session);

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default axiosClient;

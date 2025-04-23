// Code: API үндсэн үйлдлийг хийх функцуудыг агуулсан файл

import { message } from "antd";
import axios from "axios";
// import { useRouter } from "next/navigation"; // ✅ Import Next.js router
// Өөрийн ашиглах гэж буй URL-г .env файлд хадгалж байгаа
// const url = import.meta.env.VITE_REACT_APP_SECRET_PROD_URL;
// const url = "process.env.REACT_APP_API_URL/v1";

const url = `${import.meta.env.VITE_API_URL}/v1`;

console.log(url,'url');
export default class Api {
  service = (type) => {
    const headers = {
      "Content-Type": type ? type : "application/json",
    };
    var accessToken = getTokenFromCookie();
    // if (accessToken) {
      // console.log(accessToken,'access');
      headers.Authorization = `Bearer ${accessToken}`;
    // }
    this.client = axios.create({
      baseURL: url,
      timeout: 60000,
      headers,
    });

    this.client.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      function (response) {
        return response;
      },

      function (error) {
        if (error && error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_Token");
          localStorage.removeItem("token_Expire");
          window.location.href = "/admin/login";
        }

        return error;
      }
    );

    return this.client;
  };
}

const api = new Api();
function callPost(path, data, type, handler) {
  return api
    .service(type)
    .post(path, data)
    .then((response) => {
      if (handler) {
        return response;
      }
      // response code 200 өөр хариу ирсэн тохиолдолд амжилтгүй гэж үзэж байгаа
      if (response?.status <= 200 || response?.status > 299) {
        message.error(response?.data?.message);
        return;
      }
      return response?.data;
    });
    
}
export const signUpUser = async (userData, isClient) => {
  if (userData.password !== userData.passwordMatch) {
    throw new Error("Passwords do not match.");
  }

  const endpoint = isClient
    ? "auth/register/client"
    : "auth/register/";

  try {
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // You can customize this to match your API error format
      throw new Error(data.message || "Signup failed.");
    }

    return data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};


function callPatch(path, data, handler) {
  return api
    .service()
    .patch(path, data)
    .then((response) => {
      if (handler) {
        return response;
      }
      if (response?.status !== 200) {
        message.error(response?.data?.message);
        return;
      }
      return response?.data;
    });
}


function  getTokenFromCookie ()  {
  try {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {} );

    if (cookies.auth_token) {
      // console.log("Retrieved token from cookie:", cookies.auth_token);
      return cookies.auth_token;
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "http://localhost:3000/signin"; // ✅ Redirect on client-side
      }
      console.warn("No auth_token found in cookies.");
      return 
    }
  } catch (error) {
    console.error("Error reading token from cookies:", error);
  }

  return null;
};
function callGet(path, responseType = "json") {
  return api
    .service()
    .get(path, { responseType })
    .then((response) => {
      if (response?.status !== 200) {
        message.error(response?.data?.message);
        return;
      }
      return response?.data;
    });
}

function callPut(path, data) {
  return api
    .service()
    .put(path, data)
    .then((response) => {
      if (response?.status !== 200) {
        message.error(response?.data?.message);
        return;
      }
      return response?.data;
    });
}

function callDelete(path, handler) {
  return api
    .service()
    .delete(path)
    .then((response) => {
      if (handler) {
        return response;
      }
      if (response?.status !== 200) {
        message.error(response?.data?.message);
        return;
      }
      return response?.data;
    });
}

export const apiService = {
  getTokenFromCookie,
  callPost,
  callGet,
  callPut,
  callDelete,
  callPatch,
  signUpUser
};

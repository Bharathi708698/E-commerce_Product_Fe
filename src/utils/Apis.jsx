import axios from "axios";

export const Config = (method, url, data) => {
  let token = localStorage.getItem("token");
  return {
    method,
    url: url,
    headers: {
      Authorization: `${token}`,
    },
    data,
  };
};

export const ApiCall = async (config) => {
  try {
    const response = await axios(config);
    return { res: response.data, status: response.status };
  } catch (error) {
    return { res: "Something went wrong. Check after sometimes" };
  }
};

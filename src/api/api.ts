import axios, { AxiosResponse } from 'axios';




export const getListOfProducts = async (): Promise<AxiosResponse<any>> => {

  const base_URL = import.meta.env.VITE_API_URL; 
  console.log("Base URL:", base_URL);

  try {
    const response = await axios.get(`${base_URL}/api/list-of-products`);
    return response;
  } catch (error) {
    console.error('Error fetching list of products:', error);
    throw error; 
  }
};

import type { productDataType } from "../types/ProductTypeData";

export const GetFeatureProduct = async (): Promise<productDataType> => {
  try {
    const data = await fetch("https://dummyjson.com/products").then((res) =>
      res.json()
    );
    return data;
  } catch (error) {
    console.log(`error from feature product function`, error);
    // Return a default value or throw an error to satisfy the return type
    // Replace the following with an appropriate default for productDataType
    throw error;
  }
};

import type { CategoryDataType } from "../types/categoryData";
import type { fullApiType } from "../types/ProductTypeData";

export const getCategoryData = async (): Promise<CategoryDataType> => {
  try {
    const data = await fetch(
      "https://dummyjson.com/products/category-list"
    ).then((res) => res.json());
    return data;
  } catch (error) {
    console.log(`error from category funcion`, error);
    throw error;
  }
};

export const categoryWiseData = async (categorySlug: string):Promise<fullApiType> => {
  try {
    return await fetch(
      `https://dummyjson.com/products/category/${categorySlug}`
    ).then((res) => res.json());
  } catch (error) {
    console.log(`error from categoryWise funcion`, error);
    throw error;
  }
};

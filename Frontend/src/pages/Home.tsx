import Menu from "../components/HomeComponents/Menu/Menu.tsx";
import Header from "../components/HomeComponents/Header/Header";
import TopNav from "../components/HomeComponents/TopNav/TopNav";
import Category from "../components/HomeComponents/Category/Category.tsx";
import Banner from "../components/HomeComponents/Banner/Banner.tsx";
import Features from "../components/HomeComponents/Features/Features.tsx";
import ShopCategory from "../components/HomeComponents/ShopCategory/ShopCategory.tsx";
import FeaturedProduct from "../components/HomeComponents/FeaturedProduct/FeaturedProduct.tsx";
import NewProduct from "../components/HomeComponents/NewProduct/NewProduct.tsx";

const Home = () => {
  return (
    <div>
      <Header />
      <TopNav />
      <Menu />
      <div className="shadow">
        <Category />
      </div>
      <Banner />
      <Features />
      <ShopCategory />
      <FeaturedProduct />
      <NewProduct />  
    </div>
  );
};

export default Home;

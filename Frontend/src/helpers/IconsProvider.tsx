import {
  FaTwitter,
  FaFacebook,
  FaPinterestP,
  FaReddit,
  FaYoutube,
  FaInstagram,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { FiSearch, FiHeadphones, FiPhoneCall } from "react-icons/fi";
import { IoIosGitCompare } from "react-icons/io";
import { BiRightArrowAlt } from "react-icons/bi";
import { LuShoppingCart, LuUserRound } from "react-icons/lu";
import {
  FaAngleDown,
  FaAngleUp,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa6";
import { BsInfoCircle, BsGeoAlt } from "react-icons/bs";

type Icons = {
  [key: string]: React.ReactNode;
};
export const icons: Icons = {
  twitter: <FaTwitter />,
  facebook: <FaFacebook />,
  pinterest: <FaPinterestP />,
  reddit: <FaReddit />,
  youtube: <FaYoutube />,
  instagram: <FaInstagram />,
  cart: <LuShoppingCart />,
  heart: <FaRegHeart />,
  user: <LuUserRound />,
  search: <FiSearch />,
  location: <BsGeoAlt />,
  compare: <IoIosGitCompare />,
  support: <FiHeadphones />,
  info: <BsInfoCircle />,
  telephone: <FiPhoneCall />,
  rightarrow: <BiRightArrowAlt />,
  downarrow: <FaAngleDown />,
  uparrow: <FaAngleUp />,
  btnArrow: <FaArrowRight />,
  arrowLeft: <FaArrowLeft />,
  arrowRight: <FaArrowRight />,
  fullStar: <FaStar />,
};

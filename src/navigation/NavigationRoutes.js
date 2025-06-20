import Login from '../containers/auth/Login';
import SplashScreen from '../containers/auth/SplashScreen';
import Favorites from '../containers/tabBar/favorites/Favorites';
import Home from '../containers/tabBar/home/Home';
import ProductDetails from '../containers/tabBar/home/ProductDetails';
import TabNavigation from './type/TabNavigation';

export const TabRoute = {
  Home,
  Favorites,
};

export const StackRoute = {
  ProductDetails,
  TabNavigation,
  Login,
  SplashScreen,
};

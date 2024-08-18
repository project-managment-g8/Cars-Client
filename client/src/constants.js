// client/src/constants.js
export const BASE_URL = ""; // If using proxy
export const PRODUCTS_URL = "/api/products";
export const USERS_URL = "/api/users";
export const ORDERS_URL = "/api/orders";
export const PAYPAL_URL = "/api/config/paypal";
export const UPLOAD_URL = "/api/upload/";
// for render use 
const apiBaseUrl = process.env.REACT_APP_API_URL;
// for local use 
// export const apiBaseUrl = "";
export default apiBaseUrl;

import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env";

cloudinary.config({
  cloud_name: envConfig.cloudinary_cloud_name,
  api_key: envConfig.cloudinary_api_key,
  api_secret: envConfig.cloudinary_api_secret,
  secure: true,
});

export default cloudinary;

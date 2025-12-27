import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "../env";

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  secure: true,
});

export default cloudinary;

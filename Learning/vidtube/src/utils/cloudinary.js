const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// configure cloundinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log('File uploaded on cloudinary. File src: ' + response.url);

    // once the file is uploaded, we would like to delete it from our server
    fs.unlinkSync(localFilePath)


  } catch (err) {
    console.log("Error on Cloudinary", err)

    // this code is used when your cloudinary api is work otherwise i return local path to make code run.
    // fs.unlinkSync(localFilePath);
    // return null;
    return localFilePath;
  }
};


const deleteFromCloudinary = async (publicId) =>{
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. Public id", publicId)
  } catch (err) {
    console.log("Error deleting from cloudinary".err)
    return null
  }
}

module.exports = {uploadOnCloudinary,deleteFromCloudinary}

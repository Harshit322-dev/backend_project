import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLAUDINARY_CLAUD_NAME, 
        api_key: process.env.CLAUDINARY_API_KEY,
        api_secret: process.env.CLAUDINARY_API_SECRET,
    });

    const uploadOnClaudinary = async (localFilePath) =>{
        try {
            if(!localFilePath) return null
            //upload the file on claudinary
           const response = await cloudinary.uploader.upload(
    localFilePath.replace(/\\/g, "/"),
    {
        resource_type: "auto"
    }
)
            //file has been uploaded on claudinary
            // console.log("File is uploaded on claudinary" ,
            //     response.url );
            fs.unlinkSync(localFilePath)
                return response;

        } catch (error) {
            fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation failed
            return null;
            
        }
    }
   
export {uploadOnClaudinary}
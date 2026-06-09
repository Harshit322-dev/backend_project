import {asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import {uploadOnClaudinary} from "../utils/claudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res)=>{

    console.log("BODY:", req.body);
console.log("FILES:", req.files);
    // res.status(200).json({
    //     message: "ok"
    // })


    //get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check fro images, check for avatar
    // upload them to claudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password}= req.body
    // console.log("email: ",email);

    // if(fullName === ""){
    //     throw new ApiError(400, "fullName is required")
    // }


    //checking required
    if(
        [fullName, email, username, password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400, "Avatar upload failed")
    }

    //checking Existed useer
    const existedUser= await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with Email or username already exist")
    }


    //upload files on local file path
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is uploaded")
    }

    //upload on claudinary
    const avatar = await uploadOnClaudinary(avatarLocalPath)
   const coverImage = coverImageLocalPath
    ? await uploadOnClaudinary(coverImageLocalPath)
    : null;
     if(!avatar){
        throw new ApiError(400, "Avatar file3456 is required")
     }

     //creation of user and entry in database
     const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
     })

     //remove password and refresh token
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
     }


     //return
     return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Succesfully")
     )

})

export  {registerUser}
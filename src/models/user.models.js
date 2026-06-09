import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type:String,
            required: true,
            trim: true,
            index: true,
        },
        avatar:{
            type: String, ///claudnary url
            required: true,

        },
        coverImage:{
            type:String,

        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "vid"
            }
        ],
        password:{
            type:String,
            required: [true, "Password is Required"]
        },
        refreshToken:{
            type: String,

        }
},
{
    timestamps: true
}
)
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next;
})

//custum method agr user password change kiya to vo to dega like 1234 but yha to hash me stored h, to check the password is correct or not //
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
} 

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)   
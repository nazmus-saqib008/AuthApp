import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test= (req, res)=>{
    res.json({
        message: "api is working",
    });
}

export const updateUser = async (req, res, next)=>{
    if(req.user.id != req.params.id ){
        return next(errorHandler(401, "You can UPDATE only your profile !"));
    }
    try{
        if(req.body.password){
            req.body.password= bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set :{
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    photo: req.body.photo,

                }
            },
            {new : true}
        );

        const {password , ...rest}= updatedUser._doc;
        res.status(200).json(rest);
        
    }
    catch(error){
        next(error);
    }
}

export const deleteUser= async (req, res, next)=>{
    console.log(req.params);
    if(req.user.id != req.params.id ){
        return next(errorHandler(401, "You can DELETE only your profile !"));
    }
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }
    catch(error){
        next(error);
    }
}
import mongoose, { Document, Model } from "mongoose";
import { IAccount } from "./bAccount";

export interface IProfile {
    name: string;
    //accountList: IAccount[]
    accountList: string[]; // we'll just pass the list of account numbers
}

export interface IUser {
    name: string;
    profileList: IProfile[];
}

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
/*
    accountList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }]
*/
    accountList: [String]
}, { _id : false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profileList: {
        type: [profileSchema]
    }
})


const User: Model<userSchema> =
  mongoose.models?.User || mongoose.model("User", userSchema);

export default User;

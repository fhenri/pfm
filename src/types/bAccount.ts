import mongoose, { Document, Model } from "mongoose";

export interface IAccount {
    _id: string;
    bankName: string;
    url: string;
    accountNumber: string;
    description: string;
    currency: string;
}

const accountSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
  },
  url : {
    type: String,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  description: String,
  currency: String,
});

const bAccount: Model<IAccount> =
  mongoose.models?.Account || mongoose.model("Account", accountSchema);

export default bAccount;


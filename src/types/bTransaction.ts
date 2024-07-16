import mongoose, { Document, Model } from "mongoose";

export interface ITransaction {
    _id: string;
    AccountNumber: string;
    Description: string;
    Comment: string;
    TransactionDate: Date;
    ValueDate: Date;
    MoneyOut: number;
    MoneyIn: number;
    Balance: number;
    Categories: string[];

    Currency: string;
    Amount: number;
    AmountEUR: number;
}

const transactionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  AccountNumber: {
    type: String,
    required: true,
  },
  Description: String,
  Comment: String,
  TransactionDate: {
    type: Date,
    required: true,
  },
  ValueDate: {
    type: Date,
    required: true,
  },
  MoneyOut: {
    type: Number,
    required: true,
  },
  MoneyIn: {
    type: Number,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  Currency: String,
  AmountEUR: {
    type: Number,
    required: true,
  },
  Balance: {
    type: Number,
    required: true,
    min: 0,
  },
  Categories: [String],
});

// Define a virtual field to retrieve the amount with sign
// getting issue using virtuals on client side
/*
transactionSchema.virtual("Amount").get(function () {
    if (this.MoneyIn > 0) {
        return this.MoneyIn;
    } else {
        return this.MoneyOut;
    }
});
*/
const bTransaction: Model<ITransaction> =
  mongoose.models?.Transaction || mongoose.model("Transaction", transactionSchema);

export default bTransaction;

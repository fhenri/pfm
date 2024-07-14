import mongoose, { Document, Model } from "mongoose";

export interface IExchangeRate {
    FromCurrency: string,
    ToCurrency: string,
    Date: Date,
    Rate: number,
}

const exchangeRateSchema = new mongoose.Schema({
  FromCurrency: {
    type: String,
    required: true,
  },
  ToCurrency: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Rate: {
    type: Number,
    required: true,
  },
});

const ExchangeRate: Model<IExchangeRate> =
  mongoose.models?.ExchangeRate || mongoose.model("ExchangeRate", exchangeRateSchema);

export default ExchangeRate;

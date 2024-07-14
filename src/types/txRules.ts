import mongoose, { Document, Model } from "mongoose";

export interface ICategoryRules {
    _id: string;
    Categories: string[];
}

const categoryRulesSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  Categories: {
    type: [String],
    required: true,
  }
});

const CategoryRules: Model<ICategoryRules> =
  mongoose.models?.CategoryRules || mongoose.model("CategoryRules", categoryRulesSchema);

export default CategoryRules;

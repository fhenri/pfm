import mongoose, { Document, Model } from "mongoose";

export interface ICategory {
    _id: mongoose.Schema.Types.ObjectId;
    CategoryName: string;
}

const categorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  CategoryName: {
    type: String,
    required: true,
  }
});

const Category: Model<ICategory> =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);

export default Category;

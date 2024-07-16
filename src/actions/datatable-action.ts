"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import bTransaction from '@/types/bTransaction';
import Category from '@/types/txCategory';

export async function setFormComment (
  prevState: { message: string } | null,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    let tx = await bTransaction.findById(formData.get('id'));
    if (tx === null) {
      return { message: "Failed to load transaction" };
    }
    tx.Comment = formData.get('comment') as string;
    tx.save();

    revalidatePath("/banking");
    return { message: "loaded transaction file" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to load file" };
  }
}

export async function setFormCategory (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  try {
    let tx = await bTransaction.findById(formData.get('id'));
    if (tx === null) {
      return { message: "Failed to load transaction" };
    }

    const action = formData.get('action') as string;

    if (action === 'push') {
        const newCategory = (formData.get('category') as string)?.trim();

        if (tx.Categories.indexOf(newCategory) === -1) {
            tx.Categories.push(newCategory);
            tx.save();
        }

        const existCategory =
          await Category.findOne({ CategoryName: newCategory }).exec();
        if (!existCategory) {
          const nCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            CategoryName: newCategory
          });
          await nCategory.save();
        }
        
    } if (action === 'splice') {
        const category = formData.get('category') as string;
        const index = tx.Categories.indexOf(category);
        if (index > -1) {
          tx.Categories.splice(index, 1); // 2nd parameter means remove one item only
          tx.save();
        }
    }

    revalidatePath("/");
    return { message: "loaded transaction file" };
  } catch (e) {
    console.log(e);
    return { message: "Failed to load file" };
  }
}
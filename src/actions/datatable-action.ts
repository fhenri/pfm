"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import * as transactionService from '@/services/transaction-service';

export async function setFormComment (
  prevState: { message: string } | null,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    transactionService.updateComment(
      formData.get('id') as string,
      formData.get('comment') as string);

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

    transactionService.updateCategory(
      formData.get('id') as string,
      formData.get('action') as string,
      formData.get('category') as string);

    revalidatePath("/");
    return { message: "loaded transaction file" };
  } catch (e) {
    console.log(e);
    return { message: "Failed to load file" };
  }
}
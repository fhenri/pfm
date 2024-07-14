"use server";

import { revalidatePath } from "next/cache";
import bAccount, { IAccount } from '@/types/bAccount';

export async function setFormAccount (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  try {
    let account = await bAccount.findById(formData.get('id'));
    if (account === null) {
      return { message: "Failed to load account" };
    }

    account.description = formData.get('description') as string;
    await account.save();

    revalidatePath("/banking");
    return { message: "update account" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to update account" };
  }
}

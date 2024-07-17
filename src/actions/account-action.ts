"use server";

import { revalidatePath } from "next/cache";
import * as accountService from '@/services/account-service';

export async function setFormAccount (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  try {
    accountService.updateDescription(formData.get('id'), formData.get('description') as string);
    revalidatePath("/banking");
    return { message: "update account" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to update account" };
  }
}

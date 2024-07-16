"use server";

import { TransactionImportStrategyFactory } from "@/parser/import-strategy";
import { revalidatePath } from "next/cache";

export async function importTransaction(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  try {
     console.log(formData)
    const fileTxType = formData.get('txBank') as string;
    const txFile = formData.get('txFile') as File;

    const strategy = TransactionImportStrategyFactory.getStrategy(fileTxType);
    const importResult = strategy.importTransactions(formData);

    revalidatePath("/banking");
    return importResult;
  } catch (e) {
    console.log(e);
    return { message: "Failed to load file" };
  }
}

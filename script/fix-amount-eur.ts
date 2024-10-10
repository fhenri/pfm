#!/usr/bin/env tsx

import mongoose, { Connection } from "mongoose";
import bTransaction, { ITransaction } from '@/types/bTransaction';
import { getAmountEUR } from "@/services/exchange-rate-service"; // Adjust the import path as necessary

async function fixAmountEUR(tableName: string) {
    console.log('fix table:', tableName);

    const transactions = await bTransaction.find({ currency: { $ne: 'EUR' } });

    for (const transaction of transactions) {
        console.log(transaction);
        const updatedAmountEUR = await getAmountEUR(
            transaction.Currency,
            transaction.Amount,  
            transaction.TransactionDate);
        console.log(updatedAmountEUR);
        transaction.AmountEUR = updatedAmountEUR;
        await transaction.save();
    }

    console.log('All transactions updated.');
}

async function main() {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        const result = await fixAmountEUR("transactions");
        console.log("complete loading ...");
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
}

main().catch(console.error);

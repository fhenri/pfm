#!/usr/bin/env tsx

import mongoose, { Connection } from "mongoose";
import Papa from 'papaparse';
import fs from 'fs';
import { saveDBRate } from '@/services/exchange-rate-service';

type CsvRowType = {
    Date: Date;
    Price: number;
};

async function importHistoricalRates(
    fromCurrency: string,
    toCurrency: string,
    filename: string) {
    console.log('import historical rates from file:', filename);

    //const readableStream = fs.createReadStream(filename, { encoding: 'utf-8' });
    const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
    const parsedResults = Papa.parse(fileContent, {
      skipEmptyLines: true,
      header: true,
      dynamicTyping: true,
      /*
      step: async (row) => {
          await saveDBRate(fromCurrency, toCurrency, row.data.Date, row.data.Price);
      },
      complete: (results) => {
        results.data.forEach(async (row) => {
            await saveDBRate(fromCurrency, toCurrency, row.Date, 1 / row.Price);
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
      */
    });

    console.log(parsedResults.data.length)
    if (parsedResults.data && parsedResults.data.length > 0) {
        for (const row of parsedResults.data as CsvRowType[]) {
            console.log(row.Date, row.Price);
            await saveDBRate(fromCurrency, toCurrency, row.Date, 1 / row.Price);
        }
    }

    return;
}

async function main() {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);

        const historicalFileName = process.argv[2] || "script/EUR_MUR_Historical_Data.2023-1.csv";

        const result = await importHistoricalRates(
            'MUR', 'EUR', 
            process.cwd() + '/' + historicalFileName);
        console.log("complete loading ...");
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
}

main().catch(console.error);

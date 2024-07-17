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

    if (parsedResults.data && parsedResults.data.length > 0) {
        for (const row of parsedResults.data as CsvRowType[]) {
            await saveDBRate(fromCurrency, toCurrency, row.Date, 1 / row.Price);
        }
    }

    return;
}

async function main() {
    //await connectToMongoDB();
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    await importHistoricalRates('MUR', 'EUR', process.cwd() + '/script/EUR_MUR_Historical_Data.csv');
    console.log("complete loading ...")
    //await closeMongoDBConnection();
    //await db.disconnect();
    //mongoose.connection.close()

}

main().catch(console.error);
/*
async function main () {
    await connectToMongoDB()
    await importHistoricalRates('MUR','EUR', process.cwd() + '/script/EUR_MUR_Historical_Data.csv')
    await closeMongoDBConnection()
}

main();
*/
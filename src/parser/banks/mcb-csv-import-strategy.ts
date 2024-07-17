import Papa from 'papaparse';
import { Readable } from 'stream'
import { Buffer } from 'buffer';

import * as accountService from '@/services/account-service';
import * as transactionService from '@/services/transaction-service';
import { ITransactionImportStrategy } from "@/parser/import-strategy";

export class mcbcsvTransactionImportStrategy implements ITransactionImportStrategy {

    private bankConfig: any;

    constructor(bankConfig: any) {
        this.bankConfig = bankConfig;
    }

    private async importCSVData(results: string[][]): Promise<void> {
        console.log("import csv results");
        let accountNumber: string;
        let accountCurrency : string;
        for (const result in results) {
            switch (result) {
                case "0":
                    //accountNumber= this.parseResult(result, "Account Number ");
                    accountNumber = results[result][0].match(/Account Number (\d+)/i)[1];
                    break;
                case "1":
                    accountCurrency = results[result][0].match(/Account Currency (\w+)/i)[1];
                    break;
                case "2":
                case "3":
                case "4":
                case "5":
                    break;
                default:
                    const transactionId = results[result][2];
                    const MoneyOut = results[result][4].replace(',', '');
                    const MoneyIn = results[result][5].replace(',', '');
                    const amount = MoneyIn > 0 ? MoneyIn : -MoneyOut;
                    const transactionDate = new Date(results[result][0]);
                    transactionService.createTransaction(
                        transactionId,
                        accountNumber,
                        accountCurrency,
                        transactionDate,
                        Date.parse(results[result][1]) as Date,
                        results[result][3],
                        MoneyOut,
                        MoneyIn,
                        amount,
                        0);
                    break;
            }
        }

        const accountId = `${this.bankConfig.alias}-${accountNumber}`;
        const account = accountService.createAccount(
            accountId,
            accountNumber,
            this.bankConfig.bank,
            this.bankConfig.url,
            accountCurrency,
            ''
        );
    }

  async importTransactions(formData: FormData): Promise<{ message: string }> {
    console.log("import csv from strategy")

    const txFile = formData.get('txFile') as File;
    const buffer = Buffer.from(await txFile.arrayBuffer());
    const stream = Readable.from(buffer);
    const parsedData = await Papa.parse(stream, {
      skipEmptyLines: true,
      /*
      // our csv files are not large enough to be handle as pure stream
      // read all and treat on complete
      step: (row) => {
        console.log("Row:", row.data);
      },
      */
      complete: (results) => {
        //console.log('Parsed results:', results.data);
        this.importCSVData(results.data);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        return { message: 'Failed to parse CSV' };
      }
    });
    return { message: "CSV transactions imported successfully" };
  }
}
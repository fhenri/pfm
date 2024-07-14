import Papa from 'papaparse';
import { Readable } from 'stream'
import fs from "node:fs/promises";

import bAccount from '@/types/bAccount';
import bTransaction from '@/types/bTransaction';
import {getCategoryForTransaction} from '@/services/categoryService';
import {getRate, getAmountEUR} from '@/services/exchangeRateService';

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
                    let tx = await bTransaction.findById(transactionId);
                    if (tx == null) {
                        console.log(`Transaction ${transactionId} not found, creating new transaction`);
                        const MoneyOut = results[result][4].replace(',', '');
                        const MoneyIn = results[result][5].replace(',', '');
                        const amount = MoneyIn > 0 ? MoneyIn : -MoneyOut;
                        const transactionDate = Date.parse(results[result][0]);
                        const dbTransaction = await bTransaction.create({
                            _id: transactionId,
                            AccountNumber: accountNumber,
                            TransactionDate: transactionDate,
                            ValueDate: Date.parse(results[result][1]),
                            Description: results[result][3],
                            Comment: '',
                            Categories: await getCategoryForTransaction(results[result][3]),
                            MoneyOut: MoneyOut,
                            MoneyIn: MoneyIn,
                            Amount: amount,
                            AmountEUR: await getAmountEUR(accountCurrency, amount, transactionDate),
                            Balance: results[result][6].replaceAll(',', ''),
                        });
                        dbTransaction.save();
                    }
                    break;
            }
        }

        const accountId = `${this.bankConfig.alias}-${accountNumber}`;
        let account = await bAccount.findById(accountId);
        if (account == null) {
            console.log(`Account ${accountId} not found, creating new account`);
            const dbAccount = await bAccount.create({
                _id: accountId,
                accountNumber: accountNumber,
                bankName: this.bankConfig.bank,
                url: this.bankConfig.url,
                currency: accountCurrency
            });
            dbAccount.save();
        } else {
            // only thing that could require an update is BankName
            account.bankName = this.bankConfig.bank;
            account.save();
        }

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
        return { message: "CSV transactions imported successfully" };
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        return { message: 'Failed to parse CSV' };
      }
    });

  }
}
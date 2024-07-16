import { cmutofxTransactionImportStrategy } from './banks/cmut-ofx-import-strategy';
import { ofxTransactionImportStrategy } from './banks/ofx-import-strategy';
import { mcbcsvTransactionImportStrategy } from './banks/mcb-csv-import-strategy';

import bankfileconfig from '@/config/parser-config.json';

export interface ITransactionImportStrategy {
  importTransactions(formData: FormData): Promise<{ message: string }>;
}

export class TransactionImportStrategyFactory {
  static getStrategy(fileTxType: string): ITransactionImportStrategy {
    const bankConfig = bankfileconfig[fileTxType];
    switch ( fileTxType ) {
      case 'cmut-ofx':
        return new cmutofxTransactionImportStrategy(bankConfig);
      case 'mcb-csv':
        return new mcbcsvTransactionImportStrategy(bankConfig);
      default:
        return new ofxTransactionImportStrategy();
    }
  }
}
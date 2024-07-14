import { cmutofxTransactionImportStrategy } from './banks/cmutofxTransactionImportStrategy';
import { ofxTransactionImportStrategy } from './banks/ofxTransactionImportStrategy';
import { mcbcsvTransactionImportStrategy } from './banks/mcbcsvTransactionImportStrategy';

import bankfileconfig from '@/config/parser.config.json';

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
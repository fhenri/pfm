import { Ofx, OfxStructure } from 'ofx-data-extractor';
import bAccount from '@/types/bAccount';
import bTransaction from '@/types/bTransaction';
import {getCategoryForTransaction} from '@/services/categoryService';
import {getAmountEUR} from '@/services/exchangeRateService';

export class cmutofxTransactionImportStrategy implements ITransactionImportStrategy {

  private bankConfig: any;

  constructor(bankConfig: any) {
    this.bankConfig = bankConfig;
  }

  async importTransactions(formData: FormData): Promise<{ message: string }> {

    const fileType = formData.get('txBank') as string;

    const txFile = formData.get('txFile') as File;
    const buffer = Buffer.from(await txFile.arrayBuffer());
    const ofx = Ofx.fromBuffer(buffer);

    const ofxContent = ofx.getContent() as OFXStructure;
    const ofxAccount = ofxContent.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;

    const accountId = `${ofxAccount.BANKACCTFROM.BANKID}-${ofxAccount.BANKACCTFROM.BRANCHID}-${ofxAccount.BANKACCTFROM.ACCTID}`;
    const accountNb = ofxAccount.BANKACCTFROM.ACCTID
    const accountCurrency = ofxAccount.CURDEF
    let account = await bAccount.findById(accountId);
    if (account == null) {
        console.log(`Account ${accountId} not found, creating new account`);
        const dbAccount = await bAccount.create({
            _id: accountId,
            accountNumber: accountNb,
            bankName: this.bankConfig.bank,
            url: this.bankConfig.url,
            currency: accountCurrency,
            description: ofxAccount.BANKACCTFROM.ACCTTYPE
        });
        dbAccount.save();
    } else {
        // only thing that could require an update is BankName
        account.bankName = this.bankConfig.bank;
        account.save();
    }

    const transactionsList = ofxAccount.BANKTRANLIST.STRTTRN;
    for (const tns of transactionsList) {
        //console.log(transaction);
        const transactionId = tns.FITID;
        let tx = await bTransaction.findById(transactionId);
        if (tx == null) {
            console.log(`Transaction ${transactionId} not found, creating new transaction`);
            const dbTransaction = await bTransaction.create({
                _id: transactionId,
                AccountNumber: accountNb,
                TransactionDate: Date.parse(tns.DTPOSTED),
                ValueDate: Date.parse(tns.DTUSER),
                Description: tns.NAME,
                Comment: '',
                Categories: await getCategoryForTransaction(tns.NAME),
                MoneyOut: tns.TRNTYPE === 'DEBIT' ? tns.TRNAMT : 0,
                MoneyIn: tns.TRNTYPE === 'CREDIT' ? tns.TRNAMT : 0,
                Amount: tns.TRNAMT,
                AmountEUR: await getAmountEUR(accountCurrency, tns.TRNAMT, Date.parse(tns.DTPOSTED)),
                Balance: 0,
            });
            dbTransaction.save();
        }
    }

    return { message: "OFX transactions imported successfully" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to load file" };
  }
}

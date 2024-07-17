import { Ofx, OfxStructure } from 'ofx-data-extractor';
import * as accountService from '@/services/account-service';
import * as transactionService from '@/services/transaction-service';
import { ITransactionImportStrategy } from "@/parser/import-strategy";

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

    const ofxContent = ofx.getContent() as OfxStructure;
    const ofxAccount = ofxContent.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;

    const accountId = `${ofxAccount.BANKACCTFROM.BANKID}-${ofxAccount.BANKACCTFROM.BRANCHID}-${ofxAccount.BANKACCTFROM.ACCTID}`;
    const accountNb = ofxAccount.BANKACCTFROM.ACCTID;
    const accountCurrency = ofxAccount.CURDEF;
    const account = accountService.createAccount(
        accountId,
        accountNb,
        this.bankConfig.bank,
        this.bankConfig.url,
        accountCurrency,
        ofxAccount.BANKACCTFROM.ACCTTYPE
    );

    const transactionsList = ofxAccount.BANKTRANLIST.STRTTRN;
    for (const tns of transactionsList) {
        //console.log(transaction);
        const transactionId = tns.FITID;
        transactionService.createTransaction(
            transactionId,
            accountNb,
            accountCurrency,
            Date.parse(tns.DTPOSTED),
            Date.parse(tns.DTUSER),
            tns.NAME,
            tns.TRNTYPE === 'DEBIT' ? tns.TRNAMT : 0,
            tns.TRNTYPE === 'CREDIT' ? tns.TRNAMT : 0,
            tns.TRNAMT,
            0);
    }

    return { message: "OFX transactions imported successfully" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to load file" };
  }
}

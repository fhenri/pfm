import { Ofx, OfxStructure } from 'ofx-data-extractor'
import bAccount from '@/types/bAccount';
import bTransaction from '@/types/bTransaction';
import { TransactionImportStrategyFactory } from "@/parser/import-strategy";

import getBufferFromFile from "@/util/file-utils";

export class ofxTransactionImportStrategy implements ITransactionImportStrategy {
  async importTransactions(formData: FormData): Promise<{ message: string }> {

    console.log('loading file using the ofx strategy')
    const fileType = formData.get('txBank') as string;

    const txFile = formData.get('txFile') as File;
    const buffer = Buffer.from(await txFile.arrayBuffer());
    //const buffer = await getBufferFromFile(txFile);
    const ofx = Ofx.fromBuffer(buffer);

    const ofxContent = ofx.getContent() as OFXStructure;
    const ofxAccount = ofxContent.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;

    const accountId = `${ofxAccount.BANKACCTFROM.BANKID}-${ofxAccount.BANKACCTFROM.BRANCHID}-${ofxAccount.BANKACCTFROM.ACCTID}`;
    const accountNb = ofxAccount.BANKACCTFROM.ACCTID
    let account = await bAccount.findById(accountId);
    if (account == null) {
        console.log(`Account ${accountId} not found, creating new account`);
        const dbAccount = await bAccount.create({
            _id: accountId,
            accountNumber: accountNb,
            currency: ofxAccount.CURDEF,
            description: ofxAccount.BANKACCTFROM.ACCTTYPE
        });
        dbAccount.save();
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
                MoneyOut: tns.TRNTYPE === 'DEBIT' ? tns.TRNAMT : 0,
                MoneyIn: tns.TRNTYPE === 'CREDIT' ? tns.TRNAMT : 0,
                Amount: tns.TRNAMT,
                Balance: 0,
            });
            //console.log(dbTransaction.Amount);
            dbTransaction.save();
        }
    }

    return { message: "OFX transactions imported successfully" };
  } catch (e) {
      console.log(e);
    return { message: "Failed to load file" };
  }
}

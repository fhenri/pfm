import bTransaction, { ITransaction } from '@/types/bTransaction';
import Category from '@/types/txCategory';
import { getCategoryForTransaction } from '@/services/category-service';
import { getAmountEUR } from '@/services/exchange-rate-service';

const getTransactionList = async(currentAccountList: string[]) : Promise<ITransaction[]> => {
    try {
        const txList = await bTransaction
        .find({
            AccountNumber: { $in: currentAccountList },
            })
        .sort({
            TransactionDate: "desc",
        });
        return txList;
    } catch (e) {
        console.error(e);
        return [];
    }
}

const createTransaction = async(
    transactionId: string,
    AccountNumber: string,
    accountCurrency: string,
    TransactionDate: Date,
    ValueDate: Date,
    Description: string,
    MoneyOut: number,
    MoneyIn: number,
    Amount: number,
    Balance: number) : Promise<ITransaction> =>{
    let tx = await bTransaction.findById(transactionId);
    if (tx == null) {
        console.log(`Transaction ${transactionId} not found, creating new transaction`);
        const dbTransaction = await bTransaction.create({
            _id: transactionId,
            AccountNumber: AccountNumber,
            TransactionDate: TransactionDate,
            ValueDate: ValueDate,
            Description: Description,
            Comment: '',
            Categories: await getCategoryForTransaction(Description),
            MoneyOut: MoneyOut,
            MoneyIn: MoneyIn,
            Amount: Amount,
            AmountEUR: await getAmountEUR(accountCurrency, Amount, TransactionDate),
            Balance: 0,
        });
        dbTransaction.save();
        return dbTransaction;
    }
return tx;
}

const updateCategory = async(id: string, action:string, category: string) : Promise<void> => {
    let tx = await bTransaction.findById(id);
    if (tx === null) {
      return { message: "Failed to load transaction" };
    }

    if (action === 'push') {
        const newCategory = category?.trim();

        if (tx.Categories.indexOf(newCategory) === -1) {
            tx.Categories.push(newCategory);
            tx.save();
        }

        const existCategory =
          await Category.findOne({ CategoryName: newCategory }).exec();
        if (!existCategory) {
          const nCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            CategoryName: newCategory
          });
          await nCategory.save();
        }

    } if (action === 'splice') {
        const category = category as string;
        const index = tx.Categories.indexOf(category);
        if (index > -1) {
          tx.Categories.splice(index, 1); // 2nd parameter means remove one item only
          tx.save();
        }
    }
}

const updateComment = async(id: string, comment: string) : Promise<void> => {
    let tx = await bTransaction.findById(id);
    if (tx === null) {
      return { message: "Failed to load transaction" };
    }
    tx.Comment = comment;
    tx.save();
}

export {
    createTransaction,
    getTransactionList,
    updateCategory,
    updateComment,
}
import bAccount, { IAccount } from '@/types/bAccount';

const getAccountList = async():Promise<IAccount[]> => {
    try {
        return await bAccount.find();
    } catch (e) {
        console.error(e);
        return [];
    }
}

const getAccountFromList = async(currentList:[string]):Promise<IAccount[]> => {
    try {
        // return account where accountNumber are part of currentList
        return await bAccount.find({ accountNumber: { $in: currentList } });
    } catch (e) {
        console.error(e);
        return [];
    }
}

const getAccountFromNumber = async(accountNumber:string) : Promise<IAccount | null> => {
    try {
        return await bAccount.findOne({ accountNumber: accountNumber });
    } catch (e) {
        console.error(e);
        return null;
    }
}

const updateDescription = async(id: string, description: string): Promise<{ message: string }> => {
    let account = await bAccount.findById(id);
    if (account === null) {
      return { message: "Failed to load account" };
    }

    account.description = description;
    await account.save();
    return { message: "account updated" };
}

const createAccount = async(
    accountId: string,
    accountNumber: string,
    bankName: string,
    url: string,
    currency: string,
    description: string)
    : Promise<void> => {
    let account = await bAccount.findById(accountId);
    if (account == null) {
        console.log(`Account ${accountId} not found, creating new account`);
        const dbAccount = await bAccount.create({
            _id: accountId,
            accountNumber: accountNumber,
            bankName: bankName,
            url: url,
            currency: currency,
            description: description
        });
        dbAccount.save();
    } else {
        // only thing that could require an update is BankName
        account.bankName = bankName;
        account.save();
    }
}

export {
    createAccount,
    getAccountFromNumber,
    getAccountList,
    getAccountFromList,
    updateDescription,
}
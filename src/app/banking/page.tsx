import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import bTransaction, { ITransaction } from '@/types/bTransaction';
import bAccount, { IAccount } from '@/types/bAccount';
import Category, { ICategory } from '@/types/txCategory';
import TransactionTableClient from '@/components/datatable/transaction-table-client';
import AccountSelectionClient from '@/components/account-selection-client';
import * as userService from '@/services/user-service';

const BankingPage = async ({ params, searchParams }: {
                             params: { slug: string | undefined }
                             searchParams: { [key: string]: string | string[] | undefined }
                           }) => {

    const accountId = searchParams['accountId'] as string;
    console.log('filter on accountId ', accountId);

    const user = await userService.getMyUser();
    const currentAccountList = await userService.getCurrentAccountList(user) as [string];

    const txList:ITransaction[]    = await getTransactionData(accountId, currentAccountList);
    const categoryList:ICategory[] = await getCategoryData();
    const accountList:IAccount[]   = await getAccountFromList(currentAccountList);
    const selectAccount:IAccount   = await getAccountFromNumber(accountId, currentAccountList) as IAccount;

    /*
import DataTableClient from '@/components/datatable/DataTableClient';
    //const selectAccount:IAccount   = accountList.find((account) => account.AccountNumber === searchParams['accountId']);
    const txListJson = JSON.parse(JSON.stringify(txList));
    const categoryListJson = JSON.parse(JSON.stringify(categoryList));
    return (
        import TransactionTableClient from '@/components/TransactionTableClient';
        <TransactionTableClient transactions={txList} />

        <AccountSelectionClient account={selectAccount} accounts={accountList}/>
        <AccountSelectionClient account={selectAccountJson} accounts={accountListJson}/>
        <DataTableClient transactions={txListJson} categories={categoryListJson}/>
        <DataTableClient transactions={txList} categories={categoryList}/>
        <DataTableClient
            isAccountSelected={isAccountSelected}
            transactions={txListDeserialize}
            categories={categoryListJson}/>
    );
    */
    /*
    handle server side warning
    Warning: Only plain objects can be passed to Client Components from Server Components.
    Objects with toJSON methods are not supported.
    Convert it manually to a simple value before passing it to props.
    */
    const txListJson = JSON.stringify(txList);
    const txListDeserialize = JSON.parse(txListJson, (key, value) => {
        // we handle date - id we dont care will be a simple string field
        if (key === "TransactionDate" || key === "ValueDate") {
            return new Date(value);
        }
        return value;
    }) as ITransaction[] | [];

    const isAccountSelected = accountId ? true : false;
    const categoryListJson = JSON.parse(JSON.stringify(categoryList));
    const accountListJson = JSON.parse(JSON.stringify(accountList));
    const selectAccountJson = JSON.parse(JSON.stringify(selectAccount));
    return (
        <>
        <TransactionTableClient
            isAccountSelected={isAccountSelected}
            accounts={accountListJson}
            transactions={txListDeserialize}
            categories={categoryListJson}/>
        </>
    );
}

const getAccountAllData = async():Promise<IAccount[]> => {
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

const getAccountFromNumber = async(accountNumber:string, currentAccountList:[string]):
Promise<IAccount | null> => {
    try {
        if (accountNumber && currentAccountList.includes(accountNumber)) {
          return await bAccount.findOne({ accountNumber: accountNumber });
        }
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const getCategoryData = async():Promise<ICategory[]> => {
    try {
        const categoryList = await Category.find().sort({
            CategoryName: "asc",
        });

        return categoryList;

    } catch (e) {
        console.error(e);
        return [];
    }
}

const getTransactionData = async(
    accountSelectedId: string,
    currentAccountList: string[]) : Promise<ITransaction[]> => {
    try {
        let queryFilter = {};
        if (accountSelectedId && currentAccountList.includes(accountSelectedId)) {
            queryFilter = {
              AccountNumber: accountSelectedId,
            };
        } else {
            queryFilter = {
              AccountNumber: { $in: currentAccountList },
            };
        }
        const txList = await bTransaction.find(queryFilter).sort({
            TransactionDate: "desc",
        });
        return txList;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default withPageAuthRequired(BankingPage, { returnTo: "/banking" });
//export default withPageAuthRequired(BankingPage);
//export default BankingPage;
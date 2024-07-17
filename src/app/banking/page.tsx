import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { ITransaction } from '@/types/bTransaction';
import { IAccount } from '@/types/bAccount';
import { ICategory } from '@/types/txCategory';
import * as transactionService from '@/services/transaction-service';
import * as accountService from '@/services/account-service';
import * as userService from '@/services/user-service';
import * as categoryService from '@/services/category-service';
import TransactionTableClient from '@/components/datatable/transaction-table-client';
import AccountSelectionClient from '@/components/account-selection-client';

const BankingPage = async () => {


    console.log("banking page - Getting current user from service");
    const user = await userService.getMyUser();
    console.log("Getting account list for current user:", user)
    const currentAccountList = await userService.getCurrentAccountList(user) as [string];

    // we're making this call to make sure we have accounts defined based on list from profile
    console.log("Getting account list from account :", currentAccountList)
    const accountList:IAccount[]   = await accountService.getAccountFromList(currentAccountList);
    console.log("Getting tx list from account :", currentAccountList)
    const txList:ITransaction[]    = await transactionService.getTransactionList(currentAccountList);
    console.log("Getting category list")
    const categoryList:ICategory[] = await categoryService.getCategoryData();

    console.log("serialization for all");
    const accountListJson = JSON.parse(JSON.stringify(accountList));
    const txListJson = JSON.stringify(txList);
    const txListDeserialize = JSON.parse(txListJson, (key, value) => {
        // we handle date - id we dont care will be a simple string field
        if (key === "TransactionDate" || key === "ValueDate") {
            return new Date(value);
        }
        return value;
    }) as ITransaction[] | [];
    const categoryListJson = JSON.parse(JSON.stringify(categoryList));

    console.log("rendering");
    return (
        <TransactionTableClient accounts={accountListJson}
                                transactions={txListDeserialize}
                                categories={categoryListJson}/>
    );
}

//export default withPageAuthRequired(BankingPage, { returnTo: "/banking" });
export default withPageAuthRequired(BankingPage);
//export default BankingPage;
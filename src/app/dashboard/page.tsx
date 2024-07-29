import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AnalyticsChart from '@/components/chart/chart-analytics';
import ChartPie from '@/components/chart/chart-pie';
import ChartSample from '@/components/chart/chart-data';
import Toolbar from '@/components/page-toolbar-client';
import * as accountService from '@/services/account-service';
import * as categoryService from '@/services/category-service';
import * as transactionService from '@/services/transaction-service';
import * as userService from '@/services/user-service';
import { IAccount } from '@/types/bAccount';
import { ICategory } from '@/types/txCategory';
import { ITransaction } from '@/types/bTransaction';

const DashboardPage = async ({
  searchParams,
}: {
  searchParams?: {
    accountId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}) => {
  const accountParams = searchParams?.accountId || '';
  const dateFrom = searchParams?.dateFrom || '';
  const dateTo = searchParams?.dateTo || '';

  const user = await userService.getMyUser();
  const currentAccountList = await userService.getCurrentAccountList(user) as [string];

  const accountListParams = accountParams ? accountParams.split('&') : [];
  const [selectedAccounts, txList] = await getTransactionsForSelectedAccounts(
    accountListParams, 
    currentAccountList, 
    dateFrom, 
    dateTo);

  // we're making this call to make sure we have accounts defined based on list from profile
  const profileAccountList:IAccount[] = await accountService.getAccountFromList(currentAccountList);
  const profileAccountListJson        = JSON.parse(JSON.stringify(profileAccountList));

  const categoryList:ICategory[] = await categoryService.getCategoryData();
  const categoryListJson         = JSON.parse(JSON.stringify(categoryList));

  const selectAccountJson = JSON.parse(JSON.stringify(selectedAccounts));
  const txListJson        = JSON.stringify(txList);
  const txListDeserialize = JSON.parse(txListJson, (key, value) => {
      // we handle date - id we dont care will be a simple string field
      if (key === "TransactionDate" || key === "ValueDate") {
          return new Date(value);
      }
      return value;
  }) as ITransaction[] | [];

    return (
      <>
        <Toolbar selectedAccounts={selectAccountJson}
                 availableAccounts={profileAccountListJson} />
        <div className="inline-flex flex-wrap gap-3">
            <ChartSample    txList={txListDeserialize} />
            <ChartPie       txList={txListDeserialize} />
            <AnalyticsChart txList={txListDeserialize} categories={categoryListJson} />
        </div>
      </>
    )
}

async function getTransactionsForSelectedAccounts(
  accountParamsList: string[], 
  currentAccountList: string[], 
  dateFrom: string, 
  dateTo: string) {
  
  let accountsToQuery = currentAccountList;
  let selectedAccounts: IAccount[] = [];

  if (accountParamsList.length > 0) {
    accountsToQuery = accountParamsList.filter(
      accountNumber => currentAccountList.includes(accountNumber));
    for (const accountNumber of accountsToQuery) {
      selectedAccounts.push(
        await accountService.getAccountFromNumber(accountNumber) as IAccount
      );
    }
  }

  const txList = await transactionService.findTransactionAccountsList(
    accountsToQuery, dateFrom, dateTo); 

  return [
    selectedAccounts, 
    txList
  ];
}

export default withPageAuthRequired(DashboardPage);
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import D3Component from '@/components/analysis/d3-component';
import BarChart from '@/components/analysis/d3-example';
import { IAccount } from '@/types/bAccount';
import * as accountService from '@/services/account-service';
import * as userService from '@/services/user-service';
import Toolbar from '@/components/page-toolbar-client';

const AnalysisPage = async () => {

    const user = await userService.getMyUser();
    const currentAccountList = await userService.getCurrentAccountList(user) as [string];
    const account = undefined;

    // we're making this call to make sure we have accounts defined based on list from profile
    const accountList:IAccount[]   = await accountService.getAccountFromList(currentAccountList);

    const accountListJson = JSON.parse(JSON.stringify(accountList));

    return (
        <>
        <Toolbar 
                account={account}
                accounts={accountListJson} />
        <div className="inline-flex">
            <D3Component />
            <BarChart />
        </div>
        </>
    );
};

export default withPageAuthRequired(AnalysisPage);
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const BudgetPage = async () => {
    return (
        <div>
            <h1>Budget Page</h1>
        </div>
    );
};

export default withPageAuthRequired(BudgetPage);
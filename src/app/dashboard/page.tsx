import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ChartSample from '@/components/chart/chart-data';

const DashboardPage = async () => {

    return (
        <ChartSample />
    )
}

export default withPageAuthRequired(DashboardPage);
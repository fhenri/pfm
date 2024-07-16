import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ChartSample from '@/components/chart/chart-data';
import ChartPie from '@/components/chart/chart-pie';

const DashboardPage = async () => {

    return (
      <div>
        <h1>Dashboard Page</h1>
        <div className="inline-flex space-x-4">
            <ChartSample />
            <ChartPie />
        </div>
      </div>
    )
}

export default withPageAuthRequired(DashboardPage);
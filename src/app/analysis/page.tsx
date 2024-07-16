import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import D3Component from '@/components/analysis/d3-component';
import BarChart from '@/components/analysis/d3-example';

const AnalysisPage = async () => {
    return (
        <div>
            <h1>Analysis Page</h1>
            <div className="inline-flex">
                <D3Component />
                <BarChart />
            </div>
        </div>
    );
};

export default withPageAuthRequired(AnalysisPage);
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const AnalysisPage = async () => {
    return (
        <div>
            <h1>Analysis Page</h1>
        </div>
    );
};

export default withPageAuthRequired(AnalysisPage);
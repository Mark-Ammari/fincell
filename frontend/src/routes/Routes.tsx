import React, {lazy} from 'react';

export const FinancialStatementScreen = lazy(() => 
    import('../containers/FinancialStatementScreen/FinancialStatementScreen')
);

export const CompanyStatsScreen = lazy(() => 
    import('../containers/CompanyStatsScreen/ComapanyStatsScreen')
);
import {lazy} from 'react';

export const CompanyStatsScreen = lazy(() => 
    import('../containers/CompanyStatsScreen/CompanyStatsScreen')
);

export const SearchCompany = lazy(() => 
    import('../containers/SearchCompany/SearchCompany')
);
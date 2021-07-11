import React from 'react';
import SearchTicker from '../../components/SearchTicker/SearchTicker';
import classes from './SearchCompany.module.css';

const SearchCompany: React.FC = () => {
    
    return (
        <section className={classes.SearchCompany}>
            <SearchTicker />
        </section>
    );
};

export default SearchCompany;


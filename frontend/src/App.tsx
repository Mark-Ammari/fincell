import React from 'react';
import './App.css';
import FinancialSection from './components/FinancialSection/FinancialSection';
import Header from './components/Header/Header';

const App: React.FC = () => {
  return (
    <div className="App">
        <Header />
        <FinancialSection reportType="income-statement-statement" ticker="AAPL" />
    </div>
  );
}

export default App;

import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Context from './context/Context';
import { CompanyStatsScreen, SearchCompany } from './routes/Routes';

const App: React.FC = () => {
  return (
    <div className="App">
      <Suspense fallback={<div></div>}>
        <Context.Provider value={{
          reportType: "",
          ticker: ""
        }}>
          <Header />
          <Routes>
            <Route path="/" element={<SearchCompany />} />
            <Route path="/stocks/:ticker/:performanceId" element={<CompanyStatsScreen />} />
          </Routes>
          <Footer />
        </Context.Provider>
      </Suspense>
    </div>
  );
}

export default App;

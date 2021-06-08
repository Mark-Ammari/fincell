import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Context from './context/Context';
import { CompanyStatsScreen } from './routes/Routes';

const App: React.FC = () => {
  return (
    <div className="App">
      <Suspense fallback={<div></div>}>
        <Context.Provider value={{
          reportType: "",
          ticker: ""
        }}>
          <Header />
          <Switch>
            <Route path="/stocks/:ticker" component={CompanyStatsScreen} />
          </Switch>
          <Footer />
        </Context.Provider>
      </Suspense>
    </div>
  );
}

export default App;

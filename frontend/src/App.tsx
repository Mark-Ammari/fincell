import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Header from './components/Header/Header';
import Context from './context/Context';
import { FinancialStatementScreen } from './routes/Routes';

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
            <Route path="/stocks/:reportType/:ticker" component={FinancialStatementScreen} />
          </Switch>
        </Context.Provider>
      </Suspense>
    </div>
  );
}

export default App;

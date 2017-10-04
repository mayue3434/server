import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Header from './Header';
const DashBoard = () => <h2>DashBoard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;
const Landing = () => <h2>Landing</h2>;

const App = () => {
    return (
    <div className='container'>
        <BrowserRouter>
            <div>
                <Header/>
                <Route exact path="/" component={Landing}/>
                <Route exact path="/surveys" component={DashBoard}/>
                <Route path="/surveys/new" component={SurveyNew}/>
            </div>
        </BrowserRouter>
    </div>
    );
};

export default App;
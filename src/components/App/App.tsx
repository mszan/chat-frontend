import React from 'react';
import Landing from './Landing/Landing';
import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Chat from './Chat/Chat';
import {isLoggedIn} from 'axios-jwt';
import {message} from 'antd';
import './App.scss';

interface Props {}

// Entry component.
const App: React.FC<Props> = () => (
    <React.Fragment>
        <Helmet>
            <title>Chat App</title>
            <meta name="description" content="Chat App" />
        </Helmet>

        {/*Main router.*/}
        <Router>
            <div>
                <Switch>
                    {/*Chat app.*/}
                    <RouteWrapper
                        component={Chat} title={"Chat"} loginRequired={true}
                        navKey={2} exact={false} path="/chat"
                    />

                    {/*Landing page.*/}
                    <RouteWrapper
                        component={Landing} title={"Welcome"} loginRequired={false}
                        navKey={1} exact path="/"
                    />
                </Switch>
            </div>
        </Router>
    </React.Fragment>

);


interface IRouteWrapper {
    component: React.ComponentType, // Component to be wrapped.
    title: string,                  // Component title.
    loginRequired: boolean,         // If true, access is only for authenticated users.
    navKey: number,                 // ChatSider index.
    exact: boolean,                 // If true, path must be exact.
    path: string,                   // Route path.
}

// Used to determinate access to authenticated-only pages.
const RouteWrapper: React.FC<IRouteWrapper> = ({component: Component, loginRequired}) => {
    const history = useHistory();
    const location = useLocation();

    // Get layout's inner component depending on logged user.
    const getComponent = () => {
        if (loginRequired) {    // If page is protected (login is required to view this page).
            if (isLoggedIn()) { return <Component  />; } // If user is logged in, return protected component.
            else {
                const previousPage = location.pathname;
                history.push('');
                message.error({
                    content: <span>You need to be logged in to access <strong>{previousPage}</strong>.</span>,
                    duration: 10
                });
            }
        } else { return <Component />; }
    };

    // Return route component.
    return (<Route render={() => getComponent()} />);
};

export default App;
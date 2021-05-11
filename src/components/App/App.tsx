import React from 'react';
import Landing from './Landing/Landing';
import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Chat from './Chat/Chat';
import {isLoggedIn} from 'axios-jwt';
import {message} from 'antd';
import './App.scss'

type Props = {}

// Main component.
const App: React.FC<Props> = () => (
    <React.Fragment>
        {/*React helmet.*/}
        <Helmet>
            <title>Chat App</title>
            <meta name="description" content="Chat App" />
        </Helmet>

        {/*Main router.*/}
        <Router>
            <div>
                <Switch>
                    {/*Chat.*/}
                    <RouteWrapper
                        component={Chat} title={"Chat"} loginRequired={true}
                        navKey={1} exact={false} path="/chat"
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

)

// Route wrapper interface.
interface IRouteWrapper {
    component: React.ComponentType, // Component to be wrapped.
    title: string,                  // Component title.
    loginRequired: boolean,         // If true, access is only for authenticated users.
    navKey: number,                 // ChatSider index.
    exact: boolean,                 // Route path exact.
    path: string,                   // Route path.
}

// Route wrapper component.
// Used to determinate access to authenticated-only pages.
const RouteWrapper: React.FC<IRouteWrapper> = ({component: Component, title, loginRequired, navKey}) => {
    let history = useHistory();
    let location = useLocation();

    // Get layout's inner component depending on logged user.
    const getComponent = () => {
        if (loginRequired) {    // If page is protected (login is required to view this page).
            if (isLoggedIn()) { return <Component  /> } // If user is logged in, return protected component.
            else {
                const previousPage = location.pathname;
                history.push('')  // Redirect to login page.
                message.error({
                    content: <span>You need to be logged in to access <strong>{previousPage}</strong>.</span>,
                    duration: 10
                });
            }
        } else { return <Component /> }
    }

    // Return route component.
    return (<Route render={() => getComponent()} />);
}

export default App;
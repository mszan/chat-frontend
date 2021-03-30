import React from 'react';
import Landing from './Landing/Landing';
import {Helmet} from "react-helmet";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Chat from './Chat/Chat';
import {isLoggedIn} from 'axios-jwt';
import { Result } from 'antd';

type Props = {}

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
                        navKey={1} exact path="/chat"
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
    navKey: number,                 // Sidebar index.
    exact: boolean,                 // Route path exact.
    path: string,                   // Route path.
}

// Route wrapper component.
// Used to determinate access to authenticated-only pages.
const RouteWrapper: React.FC<IRouteWrapper> = ({component: Component, title, loginRequired, navKey}) => {
    // Get layout's inner component depending on logged user.
    const getComponent = () => {
        if (loginRequired) {
            if (isLoggedIn()) {
                return <Component  />
            } else {
                return (
                    <Result
                        title=""
                        subTitle="You need to be logged in to view this page."
                    />
                )
            }
        } else {
            return <Component />
        }
    }

    return (
        <Route render={() => getComponent()} />
    );
}

export default App;
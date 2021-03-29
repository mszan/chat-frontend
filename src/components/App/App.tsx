import React from 'react';
import Landing from './Landing/Landing';
import {Helmet} from "react-helmet";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Chat from './Chat/Chat';

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
                    <Route path="/chat">
                        <Chat />
                    </Route>

                    {/*Landing page.*/}
                    <Route path="/">
                        <Landing />
                    </Route>
                </Switch>
            </div>
        </Router>
    </React.Fragment>

)

export default App;
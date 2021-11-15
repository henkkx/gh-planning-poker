import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CreateSessionView } from "../screens/create-session";
import Home from "../screens/home";
import Login from "../screens/login";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/play" component={CreateSessionView} />
      <Route path="*" component={() => <p>not found</p>} />
    </Switch>
  );
}

export default AppRoutes;

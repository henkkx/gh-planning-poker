import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { CreateSessionView } from "../screens/create-session";
import Home from "../screens/home";
import ErrorScreen from "../screens/error";
import PokerView from "../screens/poker-session";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/play/:id" component={PokerView} />
      <Route path="/play" component={CreateSessionView} />
      <Route path="*" component={ErrorScreen} />
    </Switch>
  );
}

export default AppRoutes;

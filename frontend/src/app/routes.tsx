import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { CreateSessionView } from "../screens/create-session";
import Home from "../screens/home";
import { NotFound } from "../screens/not-found";
import PokerView from "../screens/poker-session";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/play" component={CreateSessionView} />
      <Route path="/poker/:id" component={PokerView} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default AppRoutes;

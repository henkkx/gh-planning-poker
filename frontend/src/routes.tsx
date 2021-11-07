import * as React from "react";
import { Switch, Route } from "react-router-dom";

const About = () => {
  return <p> About </p>;
};

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={() => <p> home </p>} />
      <Route path="/about" component={About} />
      <Route path="/play" component={() => <p> play </p>} />
      <Route path="*" component={() => <p>not found</p>} />
    </Switch>
  );
}

export default AppRoutes;

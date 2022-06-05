import React from "react";
import * as icons24 from "./components/Icons24/Index";
import * as icons14 from "./components/Icons14/Index";

import "./App.css";

/**
 * Show all imported icons in different si
 * @return {*}
 * @constructor
 */
function App() {
  return (
    <div className="App">
      <h1>24</h1>
      <div className="all-you-imported-icons">
        {Object.values(icons24).map((IconComponent) => (
          <IconComponent color="light" size="100" key={IconComponent.name} />
        ))}
      </div>
      <h1>14</h1>
      <div className="all-you-imported-icons">
        {Object.values(icons14).map((IconComponent) => (
          <IconComponent color="light" size="100" key={IconComponent.name} />
        ))}
      </div>
    </div>
  );
}

export default App;

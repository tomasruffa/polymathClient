import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import configureStore from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

let configuredStore = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configuredStore.store}>

      <PersistGate loading={null} persistor={configuredStore.persistor}>

        <App />
    </PersistGate>
    </Provider>


  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();

import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import App from "./Pages/App";
import { ChakraProvider } from "@chakra-ui/react";
import Projects from "./Pages/Projects";
import Settings from "./Pages/Settings";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import theme from './utils/theme'
import Project from "./Pages/Project";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import Monitor from "./Pages/Monitor";

Sentry.init({
  dsn: "https://af1db286b9844d3c852640f235b4ab2b@o4504119170105344.ingest.sentry.io/4504119172464640",
  integrations: [new BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initalColorMode} />
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Projects />} />
              <Route path='/monitor' element={<Monitor />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path='/projects/:id' element={<Project />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

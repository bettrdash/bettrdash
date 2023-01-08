import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api";
import theme from './utils/theme'
import './index.css'

//pages
import App from "./pages/App";
import Project from "./pages/projects/Project";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Projects from "./pages/projects/Projects";
import Login from "./pages/auth/Login";
import Monitor from "./pages/Monitor";
import Analytics from "./pages/analytics/Analytics";
import WebsiteAnalytic from "./pages/analytics/WebsiteAnalytic";

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initalColorMode} />
        <Router >
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Projects />} />
              {/* <Route path="/monitor" element={<Monitor />} /> */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path='/projects/:id' element={<Project />} />
              {/* <Route path="/analytics" element={<Analytics />} /> */}
              {/* <Route path="/analytics/:id" element={<WebsiteAnalytic />} /> */}
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

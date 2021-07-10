import React from "react"
import ReactDOM from "react-dom"
import "./styles/index.css"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"

/**
 * Default method of setting up a Create React App (CRA)
 * The 'App' component is rendered on the <div> with id "root" in index.html
 */
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
)

reportWebVitals()

import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "../../lib/components/ContentApp";

export const mountContentRootComponent = () => {
  const container = document.createElement("div");
  container.id = "note-me-component-root";
  const shadowRoot = container.attachShadow({ mode: "open" });
  document.body.appendChild(container);

  const styleLink = document.createElement("link");
  styleLink.setAttribute("rel", "stylesheet");
  styleLink.setAttribute("href", chrome.runtime.getURL("styles.css")); // Adjust the path to your styles.css
  shadowRoot.appendChild(styleLink);

  const shadowContainer = document.createElement("div");
  shadowRoot.appendChild(shadowContainer);

  const root = ReactDOM.createRoot(shadowContainer);
  root.render(<ContentApp />);
};

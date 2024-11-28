import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import LexicalEditor from "./LexicalEditor.jsx";
import "@coreui/coreui/scss/coreui.scss"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <LexicalEditor/>
    </StrictMode>
);

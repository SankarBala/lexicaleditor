import React from "react";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {EditorConfig} from "./EditorConfig";
import Toolbar from "./Toolbar";
import "./LexicalEditor.scss";


function LexicalEditor(props) {
    return (
        <div className="lexical-editor">
            <LexicalComposer initialConfig={EditorConfig}>
                <Toolbar/>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="content-editable"/>}
                    placeholder="Write some text..."
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin/>
                <ListPlugin/>
                <LinkPlugin/>
            </LexicalComposer>
        </div>
    );
}

export default LexicalEditor;

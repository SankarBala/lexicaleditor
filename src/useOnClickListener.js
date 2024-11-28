import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  $createTextNode,
  TextNode,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { useCallback } from "react";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from "@lexical/selection";
import { eventTypes } from "./Buttons.jsx";
// import useModal from 'src/views/components/textEditor/common/hooks/useModal'

const CHANGE_FONT_SIZE_COMMAND = "CHANGE_FONT_SIZE";

const LowPriority = 1;

const useOnClickListener = () => {
  const [editor] = useLexicalComposerContext();
  // const [modal, showModal] = useModal()
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const [selectedEventTypes, setSelectedEventTypes] = useState([]);

  // const [textColor, setTextColor] = useState('#000000')
  // const [backgroundColor, setBackgroundColor] = useState('#f3e')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    let allSelectedEvents = [...selectedEventTypes];

    // inner function

    const pushInEventTypesState = (selectionFormat, event) => {
      if (selectionFormat) {
        if (selectedEventTypes.includes(event)) return;
        else allSelectedEvents.push(event);
      } else {
        allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
      }
    };

    // range selection (e.g. like to bold only the particular area of the text)
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          setBlockType(type);
        }
      }

      pushInEventTypesState(selection.hasFormat("bold"), eventTypes.formatBold);
      pushInEventTypesState(
        selection.hasFormat("italic"),
        eventTypes.formatItalic
      );
      pushInEventTypesState(
        selection.hasFormat("underline"),
        eventTypes.formatUnderline
      );
      pushInEventTypesState(
        selection.hasFormat("strikethrough"),
        eventTypes.formatStrike
      );
      pushInEventTypesState(selection.hasFormat("code"), eventTypes.formatCode);

      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        if (!allSelectedEvents.includes(eventTypes.formatInsertLink))
          allSelectedEvents.push(eventTypes.formatInsertLink);
        setIsLink(true);
      } else {
        if (allSelectedEvents.includes(eventTypes.formatInsertLink)) {
          allSelectedEvents = allSelectedEvents.filter(
            (ev) => ev !== eventTypes.formatCode
          );
        }
        setIsLink(false);
      }

      setSelectedEventTypes(allSelectedEvents);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const onClick = (eventType) => {
    if (eventType === eventTypes.formatUndo) {
      editor.dispatchCommand(UNDO_COMMAND);
    } else if (eventType === eventTypes.formatRedo) {
      editor.dispatchCommand(REDO_COMMAND);
    } else if (eventType === eventTypes.formatBold) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    } else if (eventType === eventTypes.formatItalic) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    } else if (eventType === eventTypes.formatStrike) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
    } else if (eventType === eventTypes.formatUnderline) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    } else if (eventType === eventTypes.formatSubScript) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
    } else if (eventType === eventTypes.formatSuperScript) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
    } else if (eventType === eventTypes.formatAlignLeft) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    } else if (eventType === eventTypes.formatAlignRight) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
    } else if (eventType === eventTypes.formatAlignCenter) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    } else if (eventType === eventTypes.formatAlignJustify) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
    } else if (eventType === eventTypes.paragraph) {
      formatParagraph();
    } else if (
      eventType === eventTypes.h1 ||
      eventType === eventTypes.h2 ||
      eventType === eventTypes.h3 ||
      eventType === eventTypes.h4 ||
      eventType === eventTypes.h5 ||
      eventType === eventTypes.h6
    ) {
      formatHeading(eventType);
    } else if (eventType === eventTypes.ul) {
      formatBulletList();
    } else if (eventType === eventTypes.ol) {
      formatNumberedList();
    } else if (eventType === eventTypes.quote) {
      formatQuote();
    } else if (eventType === eventTypes.formatCode) {
      formatCode();
    } else if (eventType === eventTypes.formatInsertLink) {
      insertLink();
    }
  };

  // const applyColor = (textColor, backgroundColor) => {
  //   editor.update(() => {
  //     const selection = $getSelection()
  //     if ($isRangeSelection(selection)) {
  //       const selectedText = selection.getTextContent()
  //       const styledNode = $createTextNode(selectedText)
  //
  //       // Add inline styles to the node
  //       styledNode.setStyle(`color: ${textColor}; background-color: ${backgroundColor};`)
  //
  //       // Replace the selected text with the styled node
  //       selection.insertNodes([styledNode])
  //     }
  //   })
  // }

  const updateStyleString = (styleString, property, value) => {
    const styles = styleString
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedStyles = styles.filter(
      (style) => !style.startsWith(`${property}:`)
    );
    updatedStyles.push(`${property}: ${value}`);
    return updatedStyles.join("; ");
  };

  const makeStyle = (property, value) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedNodes = selection.getNodes();
        selectedNodes.forEach((node) => {
          if (node instanceof TextNode) {
            const currentStyle = node.getStyle() || ""; // Get existing styles
            const updatedStyle = updateStyleString(
              currentStyle,
              property,
              value
            );
            node.setStyle(updatedStyle);
          }
        });
      }
    });
  };

  const applyColor = (styleType, colorValue) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();

        nodes.setStyle("jj");
        nodes.forEach((node) => {
          if (node.getType() === "text") {
            if (styleType === "color") {
              node.setStyle(`color: ${colorValue};`);
            } else if (styleType === "background") {
              node.setStyle(`background-color: ${colorValue};`);
            }
          }
        });
      }
    });
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (eventType) => {
    if (blockType !== eventType) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(eventType));
        }
      });
    }
  };

  const changeFontSize = (size) => {
    console.log(size);

    editor.update(() => {
      const selection = $getSelection();
      // const selection = editor.getEditorState().getSelection()
      if ($isRangeSelection(selection)) {
        // selection.setStyle('font-size:56px')
        console.log(selection.getTextContent());
        console.log(selection.getNodes());
        console.log(selection.anchor);

        editor.dispatchCommand(CHANGE_FONT_SIZE_COMMAND, 56);

        // $setSelectionStyle(selection, {
        //   'font-size': `${size}px`,
        // })
      }
    });
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      console.log("dispatch command ");
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
      // below code insert the new block but we only need to format the specific part of the text into code format
      //   editor.update(() => {
      //     const selection = $getSelection();

      //     if ($isRangeSelection(selection)) {
      //       $wrapNodes(selection, () => $createCodeNode());
      //     }
      //   });
    }
  };

  return {
    onClick,
    selectedEventTypes,
    blockType,
    isLink,
    editor,
    changeFontSize,
  };
};

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default useOnClickListener;

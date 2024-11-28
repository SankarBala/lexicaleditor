import React, {createElement, useState} from "react";
import useOnClickListener from "./useOnClickListener";
import {
    CButton,
    CButtonGroup,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormInput,
    CFormRange,
    CModal,
} from "@coreui/react";

import {CompactPicker, SketchPicker} from "react-color";

import FormatableDropdown from "./views/dropdown/FormatableDropdown";

import {
    MdFormatAlignCenter,
    MdFormatAlignJustify,
    MdFormatAlignLeft,
    MdFormatAlignRight,
    MdFormatBold,
    MdFormatColorText,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdImage,
    MdInsertLink,
    MdOutlineAnchor,
    MdOutlineAudiotrack,
    MdOutlineFormatUnderlined,
    MdOutlineStrikethroughS,
    MdOutlineSubscript,
    MdOutlineVideoSettings,
    MdRedo,
    MdSubscript,
    MdSuperscript,
    MdUndo,
} from "react-icons/md";
import {BiLogoYoutube} from "react-icons/bi";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    TextNode,
} from "lexical";

const Toolbar = () => {
    const {
        onClick,
        selectedEventTypes,
        blockType,
        isLink,
        editor,
        modal,
        applyColor,
        changeFontSize,
    } = useOnClickListener();
    const isIconSelected = (plugin) =>
        selectedEventTypes.includes(plugin.event) ||
        blockType.includes(plugin.event);
    const [popColorPicker, setPopColorPicker] = useState(false);
    const [popBackGroundColorPicker, setPopBackGroundColorPicker] =
        useState(false);
    const [selectedTextColor, setSelectedTextColor] = useState("black");
    const [selectedBackgroundColor, setSelectedBackgroundColor] =
        useState("white");
    const [visible, setVisible] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [popFontSizer, setPopFontSizer] = useState(false);

    function updateStyleString(styleString, property, value) {
        const styles = styleString
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);

        const updatedStyles = styles.filter(
            (style) => !style.startsWith(`${property}:`)
        );
        updatedStyles.push(`${property}: ${value}`);
        return updatedStyles.join("; ");
    }


    const styleOptions = [
        {
            event: "paragraph",
            title: "Normal",
            tag: "p",
        },
        {
            event: "formatCode",
            title: "Blockquote",
            tag: "blockquote",
        },
        {
            event: "formatCode",
            title: "Code",
            tag: "code",
        },
        {
            event: "h1",
            title: "Heading 1",
            tag: "h1",
        },
        {
            event: "h2",
            title: "Heading 2",
            tag: "h2",
        },
        {
            event: "h3",
            title: "Heading 3",
            tag: "h3",
        },
        {
            event: "h4",
            title: "Heading 4",
            tag: "h4",
        },
        {
            event: "h5",
            title: "Heading 5",
            tag: "H5",
        },
        {
            event: "h6",
            title: "Heading 6",
            tag: "h6",
        },
    ];

    const fontOptions = [
        {
            event: "paragraph",
            title: "Arial",
            tag: "p",
        },
        {
            event: "formatCode",
            title: "Times New Roman",
            tag: "p",
        },
    ];

    const fontFormat = [
        {
            Icon: <MdFormatBold/>,
            event: "formatBold",
            title: "Bold",
        },
        {
            Icon: <MdFormatItalic/>,
            event: "formatItalic",
            title: "Italic",
        },
        {
            Icon: <MdOutlineFormatUnderlined/>,
            event: "formatUnderline",
            title: "Underline",
        },
        {
            Icon: <MdOutlineStrikethroughS/>,
            event: "formatStrike",
            title: "Strikethrough",
        },
    ];

    const listType = [
        {
            Icon: <MdFormatListBulleted/>,
            event: "ul",
            title: "Unordered List",
        },

        {
            Icon: <MdFormatListNumbered/>,
            event: "ol",
            title: "Ordered List",
        },
    ];

    const alignButtons = [
        {
            Icon: <MdFormatAlignLeft/>,
            event: "formatAlignLeft",
            title: "Align Left",
        },
        {
            Icon: <MdFormatAlignCenter/>,
            event: "formatAlignCenter",
            title: "Align Center",
        },
        {
            Icon: <MdFormatAlignRight/>,
            event: "formatAlignRight",
            title: "Align Right",
        },
        {
            Icon: <MdFormatAlignJustify/>,
            event: "formatAlignJustify",
            title: "Align Justify",
        },
    ];

    const changeHistory = [
        {
            Icon: <MdUndo/>,
            event: "formatUndo",
        },
        {
            Icon: <MdRedo/>,
            event: "formatRedo",
        },
    ];

    return (
        <div className="mb-1 toolbar d-flex justify-content-between">
            <CModal
                visible={popColorPicker}
                onClose={() => setPopColorPicker(false)}
                aria-labelledby="popColorPicker"
                alignment="center"
                size="sm"
            >
                <SketchPicker
                    color={selectedTextColor}
                    onChangeComplete={(color) => setSelectedTextColor(color)}
                    className="m-auto modal-sketch-picker"
                    backgroundColor={selectedTextColor}
                />
            </CModal>

            <FormatableDropdown
                title={"Style"}
                options={styleOptions}
                onSelect={(option) => {
                    onClick(option.event);
                }}
            />

            <FormatableDropdown
                title={"Font"}
                options={fontOptions}
                onSelect={(option) => {
                    onClick(option.event);
                }}
            />

            <CDropdown className="formated-dropdown tools">
                <CDropdownToggle
                    className="tool p-0 m-0 text-center"
                    style={{width: "35px"}}
                    title="Font Size"
                >
                    {fontSize}
                </CDropdownToggle>
                <CDropdownMenu
                    className="cursor-pointer rounded-2 py-0 px-2 bg-secondary"
                    style={{height: 26}}
                >
                    <CFormRange
                        id="fontSizeRanger"
                        className="border-0 p-0 m-0"
                        min={8}
                        max={120}
                        step={2}
                        value={fontSize}
                        // onChange={(event) => setFontSize(event.target.value)}
                        onChange={(event) => {
                            setFontSize(event.target.value);
                            changeFontSize(fontSize);
                        }}
                    />
                </CDropdownMenu>
            </CDropdown>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                {fontFormat.map((button, index) => (
                    <CButton
                        key={index}
                        className="tool"
                        onClick={() => onClick(button.event)}
                        title={button.title}
                    >
                        {button.Icon}
                    </CButton>
                ))}
            </CButtonGroup>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                <CButton
                    className="tool"
                    onClick={() => onClick("formatSubScript")}
                    title="Subscript"
                >
                    <MdSubscript/>
                </CButton>
                <CButton
                    className="tool"
                    onClick={() => onClick("formatSuperScript")}
                    title="Superscript"
                >
                    <MdSuperscript/>
                </CButton>
            </CButtonGroup>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                {listType.map((button, index) => (
                    <CButton
                        key={index}
                        className="tool"
                        onClick={() => onClick(button.event)}
                        title={button.title}
                    >
                        {button.Icon}
                    </CButton>
                ))}
            </CButtonGroup>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                {alignButtons.map((button, index) => (
                    <CButton
                        key={index}
                        className="tool"
                        onClick={() => onClick(button.event)}
                        title={button.title}
                    >
                        {button.Icon}
                    </CButton>
                ))}
            </CButtonGroup>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                <CButton
                    className="tool"
                    onClick={() => setPopColorPicker(true)}
                    title="Font Color"
                >
                    <MdFormatColorText/>
                </CButton>
                <CButton
                    className="tool"
                    onClick={() => onClick("textColor")}
                    title="Background Color"
                >
                    <MdFormatColorText className="text-light bg-secondary"/>
                </CButton>
            </CButtonGroup>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                <CButton
                    className="tool"
                    onClick={() => onClick("insertImage")}
                    title="Insert Image"
                >
                    <MdImage/>
                </CButton>
                <CButton
                    className="tool"
                    onClick={() => onClick("insertImage")}
                    title="Insert Video"
                >
                    <MdOutlineVideoSettings/>
                </CButton>
                <CButton
                    className="tool"
                    onClick={() => onClick("insertImage")}
                    title="Insert Audio"
                >
                    <MdOutlineAudiotrack/>
                </CButton>
            </CButtonGroup>

            <CButton
                className="tool"
                onClick={() => onClick("formatInsertLink")}
                title="Link | Anchor"
            >
                <MdInsertLink/>
            </CButton>

            <CDropdown className="formated-dropdown tools">
                <CDropdownToggle color="" className="border-0 btn tool px-2">
                    Insert
                </CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem>Table</CDropdownItem>
                    <CDropdownItem>Columns Layout</CDropdownItem>
                    <CDropdownItem>Collapsible Container</CDropdownItem>
                    <CDropdownItem>Youtube Video</CDropdownItem>
                </CDropdownMenu>
            </CDropdown>

            <CButtonGroup className="tools" role="group" aria-label="button group">
                <CButton
                    className="tool"
                    onClick={() => onClick("formatUndo")}
                    title="Undo"
                >
                    <MdUndo/>
                </CButton>
                <span className="text-secondary">|</span>
                <CButton
                    className="tool"
                    onClick={() => onClick("formatRedo")}
                    title="Redo"
                >
                    <MdRedo/>
                </CButton>
            </CButtonGroup>

            <CButton
                className="tool"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            const selectedNodes = selection.getNodes();
                            selectedNodes.forEach((node) => {
                                if (node instanceof TextNode) {
                                    const currentStyle = node.getStyle() || ""; // Get existing styles
                                    const updatedStyle = updateStyleString(
                                        currentStyle,
                                        "color",
                                        "red"
                                    );
                                    node.setStyle(updatedStyle);
                                }
                            });
                        }
                    });
                }}
            >
                Color
            </CButton>

            <CButton
                className="tool"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();

                        if ($isRangeSelection(selection)) {
                            const selectedN = selection.getTextContent();
                            // selectedN.setStyle('font-size:56px')

                            // selectedN.toUpperCase()
                            // const selectedNodes = selection.getNodes()
                            // selectedNodes.forEach((node) => {
                            //   if (node instanceof TextNode) {
                            //     const currentStyle = node.getStyle() || '' // Get existing styles
                            //     const updatedStyle = updateStyleString(currentStyle, 'font-size', '56px')
                            //     node.setStyle(updatedStyle)
                            //   }
                            // })
                        }
                    });
                }}
            >
                Font
            </CButton>
            <CButton
                className="tool"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            const selectedNodes = selection.getNodes();
                            selectedNodes.forEach((node) => {
                                if (node instanceof TextNode) {
                                    node.setStyle("");
                                }
                            });
                        }
                    });
                }}
            >
                Reset
            </CButton>
        </div>
    );
};

export default Toolbar;

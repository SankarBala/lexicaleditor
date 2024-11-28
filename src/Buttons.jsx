import React from "react";
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
    MdFormatQuote,
    MdImage,
    MdInsertLink,
    MdOutlineFormatUnderlined,
    MdOutlineStrikethroughS,
    MdRedo,
    MdUndo,
} from "react-icons/md";
import {
    BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6,
} from "react-icons/bs";
import {IoMdCode} from "react-icons/io";

export const eventTypes = {
    paragraph: "paragraph",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    ul: "ul",
    ol: "ol",
    quote: "quote",
    formatCode: "formatCode",
    formatUndo: "formatUndo",
    formatRedo: "formatRedo",
    formatBold: "formatBold",
    formatItalic: "formatItalic",
    formatUnderline: "formatUnderline",
    formatStrike: "formatStrike",
    formatSubScript: "formatSubScript",
    formatSuperScript: "formatSuperScript",
    formatInsertLink: "formatInsertLink",
    formatAlignLeft: "formatAlignLeft",
    formatAlignCenter: "formatAlignCenter",
    formatAlignRight: "formatAlignRight",
    formatAlignJustify: "formatAlignJustify",
    insertImage: "insertImage",
    textColor: "textColor",
    backgroundColor: "backgroundColor",
};

const buttonList = [{
    subitems: {
        layout: "vertical", options: [{
            Icon: <BsTypeH1/>, event: eventTypes.paragraph, text: "Normal", tag: "p",
        }, {
            Icon: <BsTypeH2/>, event: eventTypes.formatCode, text: "Blockquote", tag: "blockquote",
        }, {
            Icon: <BsTypeH1/>, event: eventTypes.h1, text: "Code", tag: "code",
        }, {
            Icon: <BsTypeH1/>, event: eventTypes.h2, text: "Heading 1", tag: "h1",
        }, {
            Icon: <BsTypeH2/>, event: eventTypes.h2, text: "Heading 2", tag: "h2",
        }, {
            Icon: <BsTypeH3/>, event: eventTypes.h3, text: "Heading 3", tag: "h3",
        }, {
            Icon: <BsTypeH4/>, event: eventTypes.h4, text: "Heading 4", tag: "h4",
        }, {
            Icon: <BsTypeH5/>, event: eventTypes.h5, text: "Heading 5", tag: "H5",
        }, {
            Icon: <BsTypeH6/>, event: eventTypes.h6, text: "Heading 6", tag: "h6",
        },],
    },
},

    {
        subitems: [{
            Icon: <MdFormatBold/>, event: eventTypes.formatBold,
        }, {
            Icon: <MdFormatItalic/>, event: eventTypes.formatItalic,
        }, {
            Icon: <MdOutlineFormatUnderlined/>, event: eventTypes.formatUnderline,
        }, {
            Icon: <MdOutlineStrikethroughS/>, event: eventTypes.formatStrike,
        },],
    },

    {
        subitems: [{
            Icon: <MdFormatListBulleted/>, event: eventTypes.ul,
        },

            {
                Icon: <MdFormatListNumbered/>, event: eventTypes.ol,
            },],
    }, {
        Icon: <MdFormatColorText/>, event: eventTypes.textColor,
    }, {
        Icon: <MdFormatColorText/>, event: eventTypes.textColor,
    }, {
        Icon: <MdFormatQuote/>, event: eventTypes.quote,
    },

    {
        Icon: <IoMdCode/>, event: eventTypes.formatCode,
    },

    {
        Icon: <MdImage/>, event: eventTypes.insertImage,
    }, {
        Icon: <MdInsertLink/>, event: eventTypes.formatInsertLink,
    }, {
        subitems: [{
            Icon: <MdFormatAlignLeft/>, event: eventTypes.formatAlignLeft,
        }, {
            Icon: <MdFormatAlignCenter/>, event: eventTypes.formatAlignCenter,
        }, {
            Icon: <MdFormatAlignRight/>, event: eventTypes.formatAlignRight,
        }, {
            Icon: <MdFormatAlignJustify/>, event: eventTypes.formatAlignJustify,
        },],
    }, {
        subitems: [{
            Icon: <MdUndo/>, event: eventTypes.formatUndo,
        }, {
            Icon: <MdRedo/>, event: eventTypes.formatRedo,
        },],
    },];

export default buttonList;

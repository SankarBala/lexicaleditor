import React, { createElement, useState } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "./FormatableDropdown.scss";
import PropTypes from "prop-types";

const FormatedDropdown = ({
  title = "Select",
  options = [],
  onSelect,
  selected = null,
}) => {
  return (
    <div>
      <CDropdown className="formated-dropdown tools">
        <CDropdownToggle color="" className="border-0 btn tool px-3">
          {title}
        </CDropdownToggle>
        <CDropdownMenu>
          {options.map((option, index) => (
            <CDropdownItem key={index} onClick={() => onSelect(option)}>
              {createElement(option.tag, null, option.title)}
            </CDropdownItem>
          ))}
        </CDropdownMenu>
      </CDropdown>
    </div>
  );
};

export default FormatedDropdown;

FormatedDropdown.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  onSelect: PropTypes.func,
  selected: PropTypes.any,
};

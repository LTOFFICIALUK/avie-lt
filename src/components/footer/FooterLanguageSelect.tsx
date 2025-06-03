import { Select } from "antd";
import React from "react";

const FooterLanguageSelect = () => {
  return (
    <Select
      defaultValue={"en"}
      style={{
        width: 100,
      }}
      options={[{ value: "en", label: "English" }]}
    ></Select>
  );
};

export default FooterLanguageSelect;

"use client";

import React, { ReactNode } from "react";
import { ConfigProvider, theme } from "antd";

interface Props {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          colorPrimary: "#84eef5",
          colorInfo: "#84eef5",
          colorBgBase: "#070c0c",
        },
        components: {
          Dropdown: {
            // Dropdown specific styling
            colorBgElevated: "var(--background)", // Dropdown background

            // Menu item styling
          },
          DatePicker: {
            colorBgContainer: "var(--color-gray)", // Input background
            colorText: "#ffffff", // Input text color
            colorTextPlaceholder: "rgba(255,255,255,0.5)", // Placeholder text color
            colorBorder: "rgba(255,255,255,0.2)", // Border color
            activeBorderColor: "var(--color-brand)", // Border color when active/focused
            hoverBorderColor: "var(--color-brand)",
          },

          Button: {
            colorPrimaryHover: "var(--color-brand-darker)",
            colorPrimaryBgHover: "var(--color-brand)", // Custom hover background

            colorPrimary: "var(--color-brand)", // Custom primary color
            colorPrimaryBg: "var(--color-brand)", // Ensure consistent primary background

            colorErrorBg: "var(--color-gray)",

            colorBgContainer: "var(--color-gray)",
            colorText: "white",
            colorTextLightSolid: "var(--color-gray)",

            controlItemBgHover: "transparent",
            controlItemBgActive: "transparent",
            controlItemBgActiveHover: "transparent",

            defaultBorderColor: "transparent",
            colorTextDisabled: "#ffffff",
            borderColorDisabled: "#cdcece",
            defaultShadow: "transparent",
            boxShadow: "transparent",
            primaryShadow: "transparent",
          },
          Message: {
            colorText: "#ffffff", // White text for messages
            colorBgContainer: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
            colorBorder: "transparent", // No visible border
            colorTextLightSolid: "#ffffff", // Ensures text is always white
            colorIcon: "#ffffff", // White icons (close, warning, etc.)
            colorTextPlaceholder: "#ffffff", // White text for any placeholders
            borderRadius: 4, // Consistent rounded corners
          },

          Select: {
            colorBgContainer: "var(--color-gray)",
            colorText: "#ffffff",
            colorTextLightSolid: "#ffffff",

            optionActiveBg: "var(--color-gray)", // Gray hover effect
            activeOutlineColor: "none",
            colorBgTextActive: "#ffffff",
            colorTextBase: "#ffffff",
            colorTextSecondary: "#ffffff",

            colorBorder: "rgba(255,255,255,0.2)",
            colorBgElevated: "var(--background)", // Dropdown background
            optionSelectedBg: "var(--color-gray)",
            borderRadius: 4,
            optionSelectedColor: "#ffffff", // White text when selected
            colorTextPlaceholder: "#ffffff", // White placeholder text
          },

          Form: {
            labelColor: "#ffffff", // Form label color
            labelFontSize: 14,
            itemMarginBottom: 16,
            verticalLabelPadding: "0 0 8px", // Padding for labels
            colorBgBase: "var(--background)",
          },
          Card: {
            colorBgContainer: "transparent",
            colorText: "#ffffff",
            colorTextLightSolid: "#ffffff",
            colorBorderSecondary: "var(--color-gray)",
            borderRadius: 8,
            boxShadowSecondary: "var(--color-brand)",
            headerBg: "transparent",
            boxShadow: "var(--color-brand)",
            extraColor: "#ffffff",
            colorPrimaryHover: "var(--color-brand)",
          },
          Input: {
            colorBgContainer: "var(--color-gray)", // Input background
            colorText: "#ffffff", // Input text color
            colorTextPlaceholder: "rgba(255,255,255,0.5)", // Placeholder text color
            colorBorder: "rgba(255,255,255,0.2)", // Border color
            activeBorderColor: "var(--color-brand)", // Border color when active/focused
            hoverBorderColor: "var(--color-brand)",
            controlOutlineWidth: 0,

            borderRadius: 4,
            paddingSM: 8, // Padding for small inputs
          },
          InputNumber: {
            colorBgContainer: "var(--color-gray)", // Input background
            colorText: "#ffffff",
            colorTextPlaceholder: "rgba(255,255,255,0.5)",
            colorBorder: "rgba(255,255,255,0.2)",
            activeBorderColor: "#ffffff",
            borderRadius: 4,
          },
          Modal: {
            contentBg: "var(--background)", // Modal content background
            headerBg: "var(--background)", // Modal header background
            titleColor: "#ffffff", // Modal title color
            titleFontSize: 18, // Title font size
            colorText: "#ffffff", // Text color in modal
            colorIcon: "#ffffff", // Close icon color
            colorIconHover: "rgba(255,255,255,0.7)",
            borderRadius: 8,
            paddingLG: 24,
            colorBgMask: "rgba(0,0,0,0.6)",
            wireframe: false,
          },
          Tabs: {
            colorText: "#ffffff", // Inactive tab text color
            itemActiveColor: "var(--color-brand)", // Active tab text color - zdaj brand color
            itemHoverColor: "#ffffff", // Hover tab text color - zdaj brez učinka lebdenja
            colorBorderSecondary: "rgba(255,255,255,0.2)", // Tab bottom border color
            cardBg: "transparent", // Card-style tabs background
            horizontalMargin: "0 0 16px 0", // Margin for horizontal tabs
            inkBarColor: "var(--color-brand)", // Indicator color za aktivni zavihek
          },
          Tooltip: {
            colorBgSpotlight: "var(--color-brand)",
            colorTextLightSolid: "var(--color-gray)",
          },
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

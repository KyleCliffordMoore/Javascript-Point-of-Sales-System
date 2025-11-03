/**
 * Layout Component
 * 
 * This component serves as a wrapper for the application's layout.
 * It renders the `children` prop (which represents the content passed to it) 
 * and includes an `OptionsBar` component at the bottom.
 * 
 * Features:
 * - Renders the content passed as `children`.
 * - Includes an `OptionsBar` component below the content.
 * 
 * Props:
 * @param {Object} props - The component's props.
 * @param {JSX.Element} props.children - The child components or elements to be rendered inside the layout.
 * 
 * @component
 * @example
 * // Example usage
 * <Layout>
 *   <HomePage />
 * </Layout>
 */

import React from "react";
import OptionsBar from "./OptionsBar";

/**
 * The Layout component renders the provided children content
 * and includes an `OptionsBar` component at the bottom of the page.
 * 
 * @param {Object} props - The component's props.
 * @param {JSX.Element} props.children - The components or elements passed to this layout for rendering.
 * @returns {JSX.Element} - The rendered layout with children and the OptionsBar.
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children} {/* Render children components */}
      <OptionsBar /> {/* Render the OptionsBar below the children */}
    </div>
  );
};

export default Layout;

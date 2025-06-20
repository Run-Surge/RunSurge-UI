// /components/DownloadToolkitButton.js

import React from "react";

// This prop `className` allows us to pass additional custom styles from the parent.
// For example, adding margins or changing font size.
const DownloadToolkitButton = ({ className = "" }) => {
  // The logic is now encapsulated here. If the URL changes, you only edit this one file.
  const googleDriveDownloadUrl =
    "https://drive.google.com/uc?export=download&id=1QfFL8jcYBJru7ZxsWNF51dcr-pHYfIxJ";

  return (
    <a
      href={googleDriveDownloadUrl}
      download="Contributor-Toolkit.zip"
      // We combine the base styles with any custom styles passed in via props.
      className={`inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg transform hover:scale-105 ${className}`}
    >
      Download Toolkit
    </a>
  );
};

export default DownloadToolkitButton;

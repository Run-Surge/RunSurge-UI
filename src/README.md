🏠 Home Page Refactor Guide — RunSurge
This guide describes how to refactor the index (Home) page to create a modern, clean landing page for RunSurge, a distributed parallel work platform. The page will include a navbar, a hero section, and a call-to-action button for resource sharing.

✅ Note: Do not change any backend routes or other endpoints. Only refactor the Home page UI.

🎯 Goals of the Refactor
✅ Build a modern landing page for RunSurge

✅ Add a responsive navbar with:

About Us (/about)

Login (/login)

Register (/register)

✅ Add a hero section with:

A headline

A supporting description

A "Share your resources and start earning" button

This reuses the existing component:
src/components/DownloadToolkitButton.js

🧱 Component: DownloadToolkitButton
Make sure the DownloadToolkitButton handles redirection to the appropriate Google Drive download link.
This component should not be modified — simply use it in the Home page.

Example location:

bash
Copy
Edit
src/components/DownloadToolkitButton.js

ensure the layout for the page is correct and syncodinzed with the layout for the whole application
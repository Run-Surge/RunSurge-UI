import './globals.css';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './components/ClientLayout';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Runsurge - Parallel work distribution platform',
  description: 'Runsurge is a platform for parallel work distribution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Franchisee Association',
  description: 'Welcome to the Franchisee Owners Association',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0070f3" />
        <title>{metadata.title}</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <header>
          <nav>
            {/* Navigation will go here */}
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; 2024 Franchisee Association</p>
        </footer>
      </body>
    </html>
  );
}

import Providers from './providers';
import LayoutComponent from '../components/Layout';
import '../index.css';
export const metadata = {
  title: 'Task Manager',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutComponent>{children}</LayoutComponent>
        </Providers>
      </body>
    </html>
  );
}

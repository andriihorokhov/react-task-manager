import LayoutComponent from '../../components/Layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <LayoutComponent>{children}</LayoutComponent>;
}

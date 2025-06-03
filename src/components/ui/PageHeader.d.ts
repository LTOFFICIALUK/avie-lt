import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

declare const PageHeader: React.FC<PageHeaderProps>;

export default PageHeader; 
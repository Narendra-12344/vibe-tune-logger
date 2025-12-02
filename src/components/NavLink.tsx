import { Link, useLocation, LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends LinkProps {
  to: string;
  activeClassName?: string;
  end?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ 
  to, 
  activeClassName = 'bg-accent text-accent-foreground', 
  end = false,
  children,
  className,
  ...props 
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
};

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type ButtonShadowProps = {
  className?: string;
  outsideBG: string;
  children: React.ReactNode;
} & ({ to: string; onClick?: never } | { to?: never; onClick?: () => void });

const ButtonShadow: React.FC<ButtonShadowProps> = ({
  children,
  onClick,
  className,
  outsideBG,
  ...props
}) => {
  const isLink = 'to' in props;

  if (isLink) {
    return (
      <Link to={props.to!} className={`mb-2 rounded-full ${outsideBG}`}>
        <Button
          className={cn(
            `mb-2 ml-1 rounded-full border-none text-[#FDF3C0]`,
            className,
          )}
        >
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <div className={`mb-2 w-full rounded-full ${outsideBG}`}>
      <Button
        className={cn(
          `mb-2 ml-1 rounded-full border-none text-[#FDF3C0]`,
          className,
        )}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
};

export default ButtonShadow;

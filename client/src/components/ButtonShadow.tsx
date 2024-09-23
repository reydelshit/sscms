import { Button } from './ui/button';

type ButtonShadowProps = {
  content: string;
  outsideBG: string;
  insideBG: string;
  customStyles?: string;
  onClick?: () => void;
};

const ButtonShadow = ({
  content,

  outsideBG,
  insideBG,
  customStyles,
  onClick,
}: ButtonShadowProps) => {
  return (
    <div className={`mb-2 rounded-full ${outsideBG}`}>
      <Button
        className={`mb-2 ml-1 ${customStyles && customStyles?.length > 0 ? customStyles : 'h-[3.5rem]'} rounded-full border-none ${insideBG} placeholder:font-bold placeholder:text-[#FDF3C0]`}
        onClick={onClick}
      >
        {content}
      </Button>
    </div>
  );
};

export default ButtonShadow;

import { Input } from './ui/input';

type InputShadowProps = {
  placeholder?: string;
  outsideBG: string;
  insideBG: string;
  customStyles?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const InputShadow = ({
  placeholder,
  outsideBG,
  insideBG,
  customStyles,
  onChange,
  type,
}: InputShadowProps) => {
  return (
    <div className={`mb-2 w-full rounded-full ${outsideBG}`}>
      <Input
        className={`mb-2 ml-1 ${customStyles && customStyles?.length > 0 ? customStyles : 'h-[3.5rem]'} rounded-full border-none ${insideBG} placeholder:font-bold placeholder:text-[#FDF3C0]`}
        placeholder={placeholder}
        onChange={onChange}
        type={type}
      />
    </div>
  );
};

export default InputShadow;

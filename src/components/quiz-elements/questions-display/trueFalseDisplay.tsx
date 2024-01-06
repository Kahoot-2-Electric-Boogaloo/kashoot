export interface TrueFalseDisplayProps {
  content: string;
}

const buttonClassName =
  " rounded-md font-semibold text-xl border-solid hover:border-2 hover:brightness-[1.2] active:scale-[.97] duration-75 ease-linear";

export default function TrueFalseDisplay(props: TrueFalseDisplayProps) {
  return (
    <div className='flex flex-col h-[100%] w-[100%] justify-center items-center relative'>
      <h1 className='text-3xl font-semibold absolute left-4 top-8 w-11/12 indent-8 select-none'>
        {props.content}
      </h1>
      <div className='grid grid-cols-1 grid-rows-2 w-10/12 absolute bottom-20 gap-4'>
        <button
          className={"bg-accent" + buttonClassName}
          style={{ minHeight: "5rem" }}
        >
          True
        </button>
        <button className={"bg-secondary" + buttonClassName}>False</button>
      </div>
    </div>
  );
}

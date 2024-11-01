interface InstanceDT {
  name: string;
  instance: number;
}

interface BoardData {
  title: string;
  data: InstanceDT[];
}

const Board = ({ title, data }: BoardData) => {
  return (
    <div className="col-span-12 gap-5 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark md:col-span-6 xl:col-span-4">
      <div className="flex text-title-sm font-bold text-black dark:text-white">
        {title}
      </div>
      <div className="my-auto flex h-full flex-col justify-center lg:gap-1 ">
        {data.length <= 0 && <div>No users</div>}
        {data &&
          data.map((data) => (
            <div className="my-1.5 mx-2 font-semiboldbold bg-meta-2  gap-1 rounded-lg px-2 py-2 dark:border-strokedark dark:bg-[#1a222c]">
              {/* <div className="my-3 flex gap-1"> */}
              <div className="relative gap-6">
                <span className="left-2 dark:text-white text-black-2 text-md">{data.name}</span>
                <span className="absolute right-2 text-sm">
                  <span className="bg:text-white font-semibold text-black-2 dark:text-white text-md">{data.instance} </span>
                  Instance
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Board;

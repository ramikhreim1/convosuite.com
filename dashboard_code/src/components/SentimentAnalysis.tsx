import Progress_bar from './ProgressBar';

const SentimentAnalysis = () => {
  return (
    <div className="col-span-12 gap-5 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark md:col-span-6 xl:col-span-4">
      <div className="flex text-title-sm font-bold text-black dark:text-white">
        Sentiment Analysis
      </div>
      <div className="h-full justify-center my-auto flex flex-col lg:gap-4">
        <div className="gap-1 px-1 py-1.5">
          {/* <div className="my-3 flex gap-1"> */}
          <div className="relative gap-6">
            <span className="left-2 text-sm">Perfect</span>
            <span className="absolute right-2 text-sm">225/250</span>
            <Progress_bar
              bgcolor={'#10b981'}
              progress={225 / 250}
              height={20}
            />
          </div>
        </div>
        <div className="gap-1 px-1 py-1.5">
          <div className="relative">
            {/* <div className="w-1/2"> */}
            <span className=" left-2 text-sm">Good</span>
            <span className="absolute right-2 self-end text-right text-sm">
              150/250
            </span>
            {/* </div> */}
            <Progress_bar
              bgcolor={'#2346d4e6'}
              progress={150 / 250}
              height={20}
            />
          </div>
        </div>
        <div className="gap-1 px-1 py-1.5">
          <div className="relative">
            <span className=" left-2 text-sm">Bad</span>
            <span className="absolute right-2 text-sm">75/250</span>
            <div className="">
              <Progress_bar
                bgcolor={'#da2828'}
                progress={75 / 250}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default SentimentAnalysis;

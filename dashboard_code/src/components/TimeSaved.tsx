import { ApexOptions } from 'apexcharts';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { AppStore } from '../store/AppStore';
import { LoaderTwo } from '../common/Loader';

const options: ApexOptions = {
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: 'in minuts',
    },
  },
  fill: {
    opacity: 1,
    colors:["rgb(255, 167, 11)"]
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + ' minute';
      },
    },
  },
};

interface ColumnChart {
  series: {
    name: string;
    data: number[];
  }[];
  options?: ApexOptions
}

interface TimeSavedPropType {
  store?: AppStore
}



const TimeSaved: React.FC<TimeSavedPropType> = inject('store')(observer(({ store }) => {
  const [isLoading, setIsloading] = useState(true)
  const [state, setState] = useState<ColumnChart
  >({
    series: [],
    options: options
  });

  React.useEffect(() => {
    getMetrics()
  }, [])

  const getMetrics = async () => {
    try {
      const response = await store?.api.post("/apis_usage/time-saved-estimation")
      if (response?.data) {
        // const data = getSimpleSeries(response?.data)
        console.log(response.data);
        const data: number[] = response.data.map((data: any) => Number(data.timeSavedInMinutes).toFixed(0));
        const category: string[] = response.data.map((data: any) => data._id);

        console.log("data: ", data);

        setState({
          series: [{ name: "", data: data }],
          options: { ...options, xaxis: { categories: category } }
        })
      }
    } catch (error) {

    } finally {
      setIsloading(false)
    }
  }
  return (
    <div className="col-span-12 gap-5 md:col-span-6 xl:col-span-4  rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex text-title-sm font-bold text-black dark:text-white">
        Time Saved Estimation:
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          {!isLoading ? <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar"
            height={350}
          /> : <LoaderTwo />}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}));

export default TimeSaved;

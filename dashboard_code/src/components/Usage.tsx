import Progress_bar from './ProgressBar';
import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getSimpleSeries } from '../utils/chart/bar';
import { inject, observer } from 'mobx-react';
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
      //   endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  yaxis: {
    title: {
      text: 'Usage',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + ' instances';
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

interface GoogleDalleUsagePropType {
  store?: AppStore
}

const UsageAnalysis: React.FC<GoogleDalleUsagePropType> = inject("store")(observer(({ store }) => {
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
      const response = await store?.api.post("/apis_usage", { names: ["google", "dalle"] })
      if (response?.data) {
        const data = getSimpleSeries(response?.data)

        setState({
          series: data.series,
          options: { ...options, xaxis: { categories: data.dayAbbreviations } }
        })
      }
    } catch (error) {

    } finally {
      setIsloading(false)
    }
  }



  return (
    <div className="col-span-12 gap-5 md:col-span-6 xl:col-span-4 gap-5 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex text-title-sm font-bold text-black dark:text-white">
        Search and Dall-E Usage
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          {state.series.length <= 0 || <>No data</>}
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

export default UsageAnalysis;

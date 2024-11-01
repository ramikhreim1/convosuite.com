import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { AppStore } from '../store/AppStore';
import { inject, observer } from 'mobx-react';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: [],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
  options: ApexOptions
}
interface ProductivityAnalysisPropType {
  store?: AppStore
}

const ProductivityAnalysis: React.FC<ProductivityAnalysisPropType> = inject('store')(observer(({ store }) => {
  const [isLoading, setIsloading] = useState(true)
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Tasks',
        data: [44, 55, 41, 67, 22, 43, 65, 72, 75, 91],
      },
    ],
    options: options
  });

  React.useEffect(() => {
    getMetrics()
  }, [])

  const getMetrics = async () => {
    try {
      const response = await store?.api.post("/apis_usage/productivity-estimation")
      if (response?.data) {
        const data: number[] = response.data.map((data: any) => Number(data.count));
        let category: string[] = response.data.map((data: any) => data._id);
        category = category.sort((a, b) => a.localeCompare(b));



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
    <div className="col-span-12 gap-5 md:col-span-6 xl:col-span-4 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Productivity Increase
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}));

export default ProductivityAnalysis;

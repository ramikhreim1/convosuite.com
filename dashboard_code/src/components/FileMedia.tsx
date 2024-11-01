import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ChartTwo from './ChartTwo';
import ChartThree from './ChartThree';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      '1 Jan',
      '2 Jan',
      '3 Jan',
      '4 Jan',
      '5 Jan',
      '6 Jan',
      '7 Jan',
      '8 Jan',
      '9 Jan',
      '10 Jan',
      '11 Jan',
      '12 Jan',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const pieOptions: ApexOptions = {
  
  chart: {
    type: 'donut',
  },
  colors: ['#10B981', '#375E83', '#259AE6', '#FFA70B'],
  labels: ['MP3', 'MOV', 'PNG', 'PDF'],
  legend: {
    show: true,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
        labels:{
          show:true,
          
          total:{
            showAlways:true,
            show:true
          },
          
        }
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface ChartThreeState {
  series: number[];
}

const FileAndMedia: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Product One',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },

      {
        name: 'Product Two',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
  });

  const [pieState, setPieState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
  });

  return (
    <div className="col-span-12 gap-2 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 md:col-span-12 xl:col-span-8">
      <div className="col-span-12">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          File and Media Interactions
        </h4>
      </div>

      <div className="flex xsm:flex-col 2xsm:flex-col sm:flex-col md:flex-col lg:flex-row">
        <div id="chartOne" className="-ml-5 lg:w-3/5 md:w-full sm:w-full">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={320}
            // width={400}
          />
        </div>
        <div
          id="chartThree"
          className="lg:w-1/4 mx-auto lg:ml-1 my-auto md:w-full sm:w-full"
        >
          <ReactApexChart
            options={pieOptions}
            series={pieState.series}
            type="donut"
            // height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default FileAndMedia;

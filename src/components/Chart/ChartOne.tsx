import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ApexCharts options
const options: ApexOptions = {
  chart: {
    type: 'area',
  },
  xaxis: {
    categories: [], // Categories will be updated dynamically
    type: 'category',
  },
  tooltip: {
    x: {
      formatter: (value: string) => value, // Show the date as is
    },
    y: {
      formatter: (value: number) => `$${value.toLocaleString()}`, // Format profit
    },
  },
  // Add other options as needed
};

interface DailyProfitDTO {
  date: string;
  totalProfit: number;
}

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
  totalProfit: number;
}

const ChartOne: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [filter, setFilter] = useState<'week' | 'month' | 'day'>('month'); // Added 'day' option
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Total Profit',
        data: [],
      },
    ],
    totalProfit: 0,
  });

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        const response = await axios.get<DailyProfitDTO[]>('/admin/monthly-profit', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        });
        const dailyProfits = response.data;

        let profitData: number[] = [];
        const categories: string[] = [];
        let totalProfit = 0; // Initialize total profit

        // Filter profits based on the selected date range
        const filteredProfits = dailyProfits.filter((p) => {
          const date = new Date(p.date);
          return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        });

        if (filter === 'month') {
          const startMonth = startDate ? startDate.getMonth() : 0; // 0-based
          const endMonth = endDate ? endDate.getMonth() : 11; // 0-based
          const startYear = startDate ? startDate.getFullYear() : new Date().getFullYear();
          const endYear = endDate ? endDate.getFullYear() : new Date().getFullYear();

          // Generate month categories
          let months = [];
          for (let year = startYear; year <= endYear; year++) {
            for (
              let month = year === startYear ? startMonth : 0;
              month <= (year === endYear ? endMonth : 11);
              month++
            ) {
              months.push(month);
            }
          }

          profitData = Array(months.length).fill(0);
          months.forEach((month, index) => {
            const monthName = new Date(0, month).toLocaleString('default', { month: 'short' });
            categories.push(monthName);
          });

          // Aggregate profits by month
          filteredProfits.forEach((p) => {
            const date = new Date(p.date);
            const month = date.getMonth();
            const monthIndex = months.indexOf(month);
            if (monthIndex >= 0) {
              profitData[monthIndex] += p.totalProfit;
              totalProfit += p.totalProfit;
            }
          });
        } else if (filter === 'week') {
          // Generate week categories
          profitData = Array(52).fill(0);
          for (let i = 1; i <= 52; i++) {
            categories.push(`Week ${i}`);
          }

          // Distribute filtered daily profits into weekly data
          filteredProfits.forEach((p) => {
            const date = new Date(p.date);
            const weekNumber = Math.ceil(date.getDate() / 7);
            const weekIndex = weekNumber - 1; // Adjust index to fit into the weekly array
            if (weekIndex >= 0 && weekIndex < profitData.length) {
              profitData[weekIndex] += p.totalProfit;
              totalProfit += p.totalProfit;
            }
          });
        } else if (filter === 'day') {
          // Handle daily profits
          const startDateStr = startDate ? startDate.toISOString().split('T')[0] : '';
          const endDateStr = endDate ? endDate.toISOString().split('T')[0] : '';
          const days = [];
          let dayData = [];

          filteredProfits.forEach((p) => {
            const date = new Date(p.date).toISOString().split('T')[0];
            if (date >= startDateStr && date <= endDateStr) {
              days.push(date);
              dayData.push(p.totalProfit);
              totalProfit += p.totalProfit;
            }
          });

          profitData = dayData;
          categories.push(...days); // Ensure categories are correctly updated
        }

        setState({
          series: [
            {
              name: 'Total Profit',
              data: profitData,
            },
          ],
          totalProfit, // Update totalProfit state
        });

        options.xaxis = options.xaxis || { categories: [] }; // Initialize if undefined
        options.xaxis.categories = categories;
      } catch (error) {
        console.error('Error fetching profit data', error);
      }
    };

    fetchProfitData();
  }, [startDate, endDate, filter]);

  const handleFilterChange = (newFilter: 'week' | 'month' | 'day') => {
    setFilter(newFilter);
  };

  return (
    <div className="col-span-12 2xl:mb-6 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Profit</p>
              <p className="text-sm font-medium">
                {state.totalProfit.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-center  ">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control dark:bg-transparent"
                placeholderText="Start Date"
              />
            </div>
            <div className="flex justify-center mt-2">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control dark:bg-transparent"
                placeholderText="End Date"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as 'week' | 'month' | 'day')}
            className="form-select dark:bg-transparent"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>
      <div id="chartOne" className="-ml-5">
        <ReactApexChart options={options} series={state.series} type="area" height={400} />
      </div>
    </div>
  );
};

export default ChartOne;

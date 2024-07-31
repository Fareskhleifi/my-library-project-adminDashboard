import { request } from '../../axios_helper';
import { useState, useEffect } from 'react';

const CardOne = () => {

  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  useEffect(() => {
    request('get', '/admin/emprunts/total')
      .then((response) => {
        setTotalTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching total transactions:', error);
      });
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1h20v14H1z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M4 4l5 4-5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 4l-5 4 5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {totalTransactions}
          </h4>
          <span className="text-sm font-medium">Total Transactions</span>
        </div>

        <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
          0.43%
          <svg
            className="fill-meta-3"
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default CardOne;

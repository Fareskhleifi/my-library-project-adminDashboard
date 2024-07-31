import Breadcrumb from '../components/Breadcrumb.tsx';
import ChartFour from '../components/Chart/ChartFour.tsx';
import ChartOne from '../components/Chart/ChartOne.tsx';
import ChartThree from '../components/Chart/ChartThree.tsx';
import ChartTwo from '../components/Chart/ChartTwo.tsx';
import DataStats from '../components/DataStats.tsx';

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
          <DataStats></DataStats>
        </div>
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;

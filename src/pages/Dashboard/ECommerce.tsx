import CardFour from '../../components/Card/CardFour.tsx';
import CardOne from '../../components/Card/CardOne.tsx';
import CardThree from '../../components/Card/CardThree.tsx';
import CardTwo from '../../components/Card/CardTwo.tsx';
import ChartOne from '../../components/Chart/ChartOne.tsx';
import ChartThree from '../../components/Chart/ChartThree.tsx';
// import DataStats from '../../components/DataStats.tsx';
import TableThree from '../../components/Table/TableThree.tsx';

const ECommerce = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
      {/* <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <DataStats></DataStats>
      </div> */}
      <div className="mt-4  grid grid-cols-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-0">
        <ChartOne />
       <ChartThree  />
        <div className="col-span-12 mt-6 xl:col-span-12">
          <TableThree />
        </div>
      </div>
    </>
  );
};

export default ECommerce;

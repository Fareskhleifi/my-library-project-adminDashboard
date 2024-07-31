import Breadcrumb from '../components/Breadcrumb';
import TableOne from '../components/Table/TableOne';
import TableThree from '../components/Table/TableThree';
import TableTwo from '../components/Table/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;

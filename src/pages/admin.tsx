import AdminPage from "@site/src/components/AdminPage";
import Head from '@docusaurus/Head';

const AdminPageWrapper = () => {
  return (
    <>
      <Head>
        <body className='no-search'></body>
      </Head>
      <AdminPage />
    </>
  );
};

export default AdminPageWrapper;
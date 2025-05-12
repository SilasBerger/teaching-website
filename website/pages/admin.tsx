import AdminPage from "@tdev-components/AdminPage";
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
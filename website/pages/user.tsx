import UserPage from '@tdev-components/UserPage';
import Head from '@docusaurus/Head';

const UserPageWrapper = () => {
    return (
        <>
            <Head>
                <body className="no-search"></body>
            </Head>
            <UserPage />
        </>
    );
};

export default UserPageWrapper;

import LoginPage from "@tdev-components/LoginPage";
import Head from '@docusaurus/Head';

const LoginPageWrapper = () => {
    return (
        <>
            <Head>
                <body className='no-search'></body>
            </Head>
            <LoginPage />
        </>
    );
};

export default LoginPageWrapper;
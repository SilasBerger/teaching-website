import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Layout from '@theme/Layout';
import {observer} from 'mobx-react-lite';
import AdminPanel from '@tdev-components/Admin/AdminPanel';

const AdminPage = observer(() => {
    return (
        <Layout>
            <main className={clsx(styles.main, 'no-search')}>
                <AdminPanel />
            </main>
        </Layout>
    );
});
export default AdminPage;

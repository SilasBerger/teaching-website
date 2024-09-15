import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import { useLocation } from '@docusaurus/router';
type Props = WrapperProps<typeof ContentType>;

const ContentWrapper = observer((props: Props): JSX.Element => {
    const { frontMatter } = useDoc();
    const pageStore = useStore('pageStore');
    const pageId = (frontMatter as { page_id: string }).page_id;
    const location = useLocation();
    React.useEffect(() => {
        if (pageId) {
            pageStore.addIfNotPresent(pageId, true);
        }
        return () => {
            pageStore.setCurrentPageId(undefined);
        };
    }, [pageId]);

    React.useEffect(() => {
        if (pageStore.current) {
            const primaryClass = location.pathname.split('/')[1];
            pageStore.current.setPrimaryStudentGroupName(primaryClass);
        }
        return () => {
            pageStore.current?.setPrimaryStudentGroupName(undefined);
        };
    }, [pageStore.current, location.pathname]);

    return (
        <>
            <Content {...props} />
        </>
    );
});

export default ContentWrapper;

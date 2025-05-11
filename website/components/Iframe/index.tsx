import styles from './styles.module.scss';

export interface Props {
    src: string;
}

export default ({ src }: Props) => {
    return <iframe allowFullScreen={true} src={src} className={styles.iframe} title="secureLINK"></iframe>;
};

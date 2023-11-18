import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from "@docusaurus/Link";

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Unterrichtswebseite Silas Berger">
      <main>
        <div>
          <Link
            className="button button--secondary button--lg"
            to="/material/overview">
            Materialbibliothek
          </Link>
        </div>
      </main>
    </Layout>
  );
}

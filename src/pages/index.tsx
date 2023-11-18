import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from "@docusaurus/Link";

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
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

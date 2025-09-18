import Layout from "@/components/Layout";
import Settings from "@/components/Settings";
import TestTranslations from "@/components/TestTranslations";

const SettingsPage = () => {
  return (
    <Layout>
      <div className="bg-transparent">
        <Settings />
        <TestTranslations />
      </div>
    </Layout>
  );
};

export default SettingsPage;
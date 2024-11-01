import InstalledExtension from '../../components/InstalledExtension.tsx';
import UserActivity from '../../components/UserActivity.tsx';
import CreditsUsed from '../../components/CreditsUsed.tsx';
import FileAndMedia from '../../components/FileMedia.tsx';
import SentimentAnalysis from '../../components/SentimentAnalysis.tsx';
import UsageAnalysis from '../../components/Usage.tsx';
import TimeSaved from '../../components/TimeSaved.tsx';
import ProductivityAnalysis from '../../components/Productivity.tsx';
import Board from '../../components/Board.tsx';
import MostActiveUsers from '../../components/MostActiveUsers.tsx';
import MostUseCase from '../../components/MostUseCase.tsx';

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <UserActivity />  {/* total user and active user */}
        <UserActivity /> {/* user activity */}
        <CreditsUsed />  {/* credits used */}
        <InstalledExtension /> {/* installed extension */}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <FileAndMedia />
        <UsageAnalysis />
        <ProductivityAnalysis />
        <TimeSaved /> {/*static data as of now*/}
        <SentimentAnalysis /> {/* need implementation in chatbot */}


        <MostUseCase />
        <MostActiveUsers />
      </div>
    </>
  );
};

export default Dashboard;

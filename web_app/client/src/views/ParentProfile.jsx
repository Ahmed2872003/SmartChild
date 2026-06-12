import { useGetUser } from '@/hooks/user';
import GamifiedLoader from '../components/common/GamifiedLoader';
import { PersonalInfoForm } from '@/components/profile/parentProfile/PersonalInfoForm';
import { SecurityForm } from '@/components/profile/parentProfile/SecurityForm';

const ParentProfile = () => {
  const userQuery = useGetUser();

  const user = userQuery.data;

  if (!userQuery.isSuccess) return <GamifiedLoader />;

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Parent Profile</h1>
          <p className="text-gray-500 font-medium">Manage your account settings and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <PersonalInfoForm user={user} />
        <SecurityForm />
      </div>
    </>
  );
};

export { ParentProfile };

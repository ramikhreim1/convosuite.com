import { inject, observer } from "mobx-react";
import { AppStore } from "../store/AppStore";

interface UserActivityPropType {
  store?: AppStore
}

const UserActivity: React.FC<UserActivityPropType> = inject("store")(observer(({ store }) => {

  return (
    <div className="rounded-sm border border-stroke bg-white py-4  px-3.5 shadow-default dark:border-strokedark dark:bg-boxdark">

      <div className="flex text-title-sm font-bold text-black dark:text-white">
        User Activity and Growth
      </div>

      <div className="flex px-0 py-3">
        <div
          className="m-1 w-auto rounded border border-stroke bg-meta-2 py-6 px-2 text-sm shadow-default dark:border-strokedark dark:bg-[#1a222c]"
        >
          Active Users
          <span className="block text-title-xl text-black dark:text-white">
            {store?.profile.users.length}
          </span>
        </div>
        <div className="m-1 w-auto rounded border border-stroke bg-meta-2 py-6 px-2  text-sm shadow-default dark:border-strokedark dark:bg-[#1a222c]">
          New Users
          <span className="block text-title-xl text-black dark:text-white">
            {store?.profile.users.length}
          </span>
        </div>
        <div className="m-1 w-auto rounded border border-stroke bg-meta-2 py-6 px-2  text-sm shadow-default dark:border-strokedark dark:bg-[#1a222c]">
          User growth
          <span className="block text-title-xl text-black dark:text-white">
            {(store?.profile.users.length || 1 / (store?.profile.users.length || 1)) * 100}%
          </span>
        </div>
      </div>
    </div>
  );
}));

export default UserActivity;

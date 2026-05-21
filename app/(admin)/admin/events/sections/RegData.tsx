import Event from "@/interfaces/event";
import RegDataTable from "../../components/Home/RegDataTable";
import { mockProfile } from "../dummyData";
import Profile from "@/interfaces/profile";
import DownloadDataBtn from "../../components/Home/DownloadDataBtn";

export default function RegData({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (event: Event) => void;
}) {
  console.log(event);
  const user = mockProfile("Hero");
  user.perms = ["download_total_data", "view_table_data"];

  const students: Profile[] = new Array(20).fill(user);

  return (
    <div className="w-full p-3">
      <div className="w-full flex justify-between items-center">
        <p className="text-lg">{`Event Registration Data Table for ${event.name}`}</p>
        <DownloadDataBtn studentPerms={user.perms} />
      </div>
      <RegDataTable user={user} data={students} />
    </div>
  );
}

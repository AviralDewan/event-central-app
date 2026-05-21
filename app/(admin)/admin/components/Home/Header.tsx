import Profile from "@/interfaces/profile";
import Image from "next/image";
import DownloadDataBtn from "./DownloadDataBtn";

export default function Header({ user }: { user: Profile }) {
  const totalRegistrations = 357;
  const avgRegPerEvent = 24;

  return (
    <div className="p-3 md:p-5 w-full flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-12 lg:gap-20 pb-5 border-b border-b-slate-400">
        <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-5">
          <Image
            src={user.pic == null ? `/images/unknown.jpg` : user.pic}
            alt="Profile Pic"
            width={50}
            height={50}
            className="w-[80] h-[80] lg:w-[100] lg:h-[100] rounded-full border-1 border-black"
          />
          <div className="">
            <p className="text-lg md:text-xl lg:text-2xl font-medium">
              {user.name}
            </p>
            <p className="mt-1 text-md md:text-lg lg:text-xl font-medium text-slate-600">
              {user.pos}
            </p>
          </div>
        </div>
        <div className="self-center mt-5 md:mt-0 hidden md:flex flex-col md:flex-row justify-center items-center gap-5 md:gap-8">
          <div className="px-5 py-3 border-2 border-slate-500 bg-slate-200 rounded-lg">
            <p className="text-center">Total Registrations:</p>
            <p className="text-center text-lg">{totalRegistrations}</p>
          </div>
          <div className="px-5 py-3 border-2 border-slate-500 bg-slate-200 rounded-lg">
            <p className="text-center">Avg Regs Per Event:</p>
            <p className="text-center text-lg">{avgRegPerEvent}</p>
          </div>
          <DownloadDataBtn studentPerms={user.perms ?? []} />
        </div>
        <div className="self-center mt-5 md:mt-0 lex flex-col md:hidden justify-center items-center gap-y-5">
          <div className="flex gap-x-5">
            <div className=" px-5 py-3 border-2 border-slate-500 bg-slate-200 rounded-lg">
              <p className="text-center">Total Registrations:</p>
              <p className="text-center text-lg">{totalRegistrations}</p>
            </div>
            <div className="px-5 py-3 border-2 border-slate-500 bg-slate-200 rounded-lg">
              <p className="text-center">Avg Regs Per Event:</p>
              <p className="text-center text-lg">{avgRegPerEvent}</p>
            </div>
          </div>
          <div className="flex justify-center mt-7">
            <DownloadDataBtn studentPerms={user.perms ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

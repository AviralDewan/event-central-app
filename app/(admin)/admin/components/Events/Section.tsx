export default function Section({
  children,
  customStyles,
}: {
  children: React.ReactNode;
  customStyles?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-600 flex flex-col p-3 gap-y-4 ${customStyles}`}
    >
      {children}
    </div>
  );
}

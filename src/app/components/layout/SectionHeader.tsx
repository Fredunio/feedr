export default function SectionHeaders({
  subHeader,
  mainHeader,
}: {
  subHeader?: string;
  mainHeader: string;
}) {
  return (
    <>
      {subHeader && (
        <h3 className="uppercase text-slate-500 font-semibold leading-4">
          {subHeader}
        </h3>
      )}
      <h2 className="text-primary font-extrabold text-4xl ">{mainHeader}</h2>
    </>
  );
}

interface PlaceholderProps {
  /** The area's label, e.g. "Quote". */
  areaName: string;
}

export default function Placeholder({ areaName }: PlaceholderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold">{areaName}</h1>
      <p className="mt-4 text-gray-600">The {areaName} area is not yet available.</p>
    </>
  );
}

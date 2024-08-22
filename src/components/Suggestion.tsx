export default function Suggestion({
  listData,
  onCityClick,
}: {
  listData: any[] | null;
  onCityClick: (lat: number, lon: number, location: string) => void;
}) {
  return listData === null ? null : listData.length > 0 ? (
    <ul className="bg-white rounded p-3 z-60 ">
      {listData.map((city, index) => (
        <li
          key={index}
          className="cursor-pointer hover:text-lg transition-all duration-200 rounded p-1 h-[30px]"
          onClick={() => onCityClick(city.lat, city.lon, city.name)}
        >
          {city.name}
        </li>
      ))}
    </ul>
  ) : (
    <div className="bg-white rounded p-3">not found</div>
  );
}

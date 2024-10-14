import {LocationDTO, LocationInfoDTO} from "../dto/dto.ts";
import React, {useState} from "react";

interface SearchProps {
  handleSearch: (query: string) => void;
}

export const SearchElement = ({handleSearch}: SearchProps) => {
  const [query, setQuery] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите локацию"
      />
      <button type="submit" onClick={
        () => {
          try {
            setError(null);
            if (query.trim()) {
              handleSearch(query);
            }
          } catch (error: any) {
            setError(error);
          }
        }
      }>Поиск
      </button>
      {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
    </div>
  );
}

interface ResultsProps {
  locations: LocationDTO[] | null;
  FetchPlaces: (location: LocationDTO) => Promise<LocationInfoDTO[]>;
  FetchPlaceInfo: (location: LocationInfoDTO) => Promise<void>
}

export const ResultsGroup: React.FC<ResultsProps> = ({
                                                       locations,
                                                       FetchPlaces,
                                                       FetchPlaceInfo
                                                     }: ResultsProps) => {
  const [locationInfo, setLocationInfo] = useState<LocationInfoDTO[] | null>(null);
  return (
    <div style={{display: 'flex'}}>
      <div>
        <ul className="list-group">
          {locations && locations.map((value, index) => (
            <li className="list-group-item" key={index}
                onClick={async () => setLocationInfo(await FetchPlaces(value))}
            >
              <h3>{value.name}</h3>
              <p>Адрес: {value.address}</p>
            </li>
          ))}
        </ul>
        {locations && locations.length == 0 && (
          <div className="list-group">`Нет подходящих локаций`</div>
        )}
      </div>
      <div>
        <ul className="list-group-places">
          {locationInfo && locationInfo.map((value, index) => (
            <li className="list-group-places-info" key={index}
                 onClick={() => FetchPlaceInfo(value)}
            >
              <h3>{value.name}</h3>
              <p>{value.description}</p>
              <p>Адрес: {value.address}</p>
              <p>{value.isClosed ? "Закрыто" : "Открыто"}</p>
            </li>
          ))}
        </ul>
        {locationInfo && locationInfo.length == 0 && (
          <div className="list-group-item-info">
            <h3>`В локации нет мест интереса, выберите другую`</h3>
          </div>
        )}
      </div>

    </div>
  );
}
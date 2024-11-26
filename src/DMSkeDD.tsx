import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DMSToDDCalculator: React.FC = () => {
  const [latitude, setLatitude] = useState({ degrees: '', minutes: '', seconds: '' });
  const [longitude, setLongitude] = useState({ degrees: '', minutes: '', seconds: '' });
  const [resultLat, setResultLat] = useState<string>('');
  const [resultLng, setResultLng] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('default');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=NU4TnQJY51sPc4xBLKl3',
        center: [0, 0],
        zoom: 2,
      });
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFunction: React.Dispatch<React.SetStateAction<any>>,
    field: string
  ) => {
    const value = e.target.value === '' ? '' : e.target.value;
    setFunction((prev: any) => ({ ...prev, [field]: value }));
  };

  const convertToDecimalDegrees = (deg: number, min: number, sec: number): number => {
    if (min < 0 || min >= 60 || sec < 0 || sec >= 60) {
      throw new Error('Menit dan detik harus dalam rentang 0-59');
    }
    const dd = Math.abs(deg) + min / 60 + sec / 3600;
    return deg < 0 ? -dd : dd;
  };

  const handleConversion = () => {
    try {
      if (
        latitude.degrees !== '' &&
        latitude.minutes !== '' &&
        latitude.seconds !== '' &&
        longitude.degrees !== '' &&
        longitude.minutes !== '' &&
        longitude.seconds !== ''
      ) {
        const latDD = convertToDecimalDegrees(
          parseFloat(latitude.degrees),
          parseFloat(latitude.minutes),
          parseFloat(latitude.seconds)
        ).toFixed(8);

        const lngDD = convertToDecimalDegrees(
          parseFloat(longitude.degrees),
          parseFloat(longitude.minutes),
          parseFloat(longitude.seconds)
        ).toFixed(8);

        setResultLat(latDD);
        setResultLng(lngDD);

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [parseFloat(lngDD), parseFloat(latDD)], zoom: 12 });
        }
      } else {
        alert('Masukkan semua nilai koordinat dengan benar');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Terjadi kesalahan yang tidak diketahui');
      }
    }
  };

  const handleAddToMaps = () => {
    if (resultLat && resultLng) {
      const lat = parseFloat(resultLat);
      const lng = parseFloat(resultLng);

      if (mapRef.current) {
        const iconUrl = selectedIcon === 'default'
          ? 'https://docs.maptiler.com/maplibre-gl-js/assets/marker.png'
          : selectedIcon;

        new maplibregl.Marker({ element: createCustomMarker(iconUrl) })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      }
    } else {
      alert('Konversikan koordinat terlebih dahulu!');
    }
  };

  const createCustomMarker = (iconUrl: string): HTMLElement => {
    const markerElement = document.createElement('div');
    markerElement.style.backgroundImage = `url(${iconUrl})`;
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.backgroundSize = 'cover';
    markerElement.style.borderRadius = '50%';
    return markerElement;
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIcon(e.target.value);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-md shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-full">
          {/* Map section */}
          <div className="lg:col-span-7 h-96 rounded-md shadow-md">
            <div ref={mapContainerRef} className="h-full w-full rounded-md shadow-md"></div>
          </div>

          {/* Calculator section */}
          <div className="lg:col-span-3 h-96 flex flex-col justify-between p-6 bg-gray-800 text-white rounded-md shadow-lg overflow-auto">
            <h2 className="text-3xl font-semibold text-center mb-4">DMS ke DD</h2>
            <p className="text-center text-gray-300 mb-4">Masukkan koordinat dalam DMS untuk dikonversi ke DD.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Latitude (DMS):</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Deg"
                    value={latitude.degrees}
                    onChange={(e) => handleInputChange(e, setLatitude, 'degrees')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    value={latitude.minutes}
                    onChange={(e) => handleInputChange(e, setLatitude, 'minutes')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Sec"
                    value={latitude.seconds}
                    onChange={(e) => handleInputChange(e, setLatitude, 'seconds')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">Longitude (DMS):</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Deg"
                    value={longitude.degrees}
                    onChange={(e) => handleInputChange(e, setLongitude, 'degrees')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    value={longitude.minutes}
                    onChange={(e) => handleInputChange(e, setLongitude, 'minutes')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Sec"
                    value={longitude.seconds}
                    onChange={(e) => handleInputChange(e, setLongitude, 'seconds')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-300">Pilih Ikon Marker:</label>
              <select
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                value={selectedIcon}
                onChange={handleIconChange}
              >
                <option value="default">Pilih</option>
                <option value="https://icons.iconarchive.com/icons/crountch/one-piece-jolly-roger/256/Luffys-flag-icon.png">One Piece</option>
                <option value="https://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/dragon-ball-online-global-icon.png">Dragon Ball</option>
              </select>
            </div>

            <div className="space-y-4">
              <button
                className="w-full bg-green-600 text-black py-2 rounded font-semibold uppercase hover:bg-green-700 transition duration-300 text-sm"
                onClick={handleConversion}
              >
                Konversi
              </button>
              <button
                className="w-full bg-blue-600 text-black py-2 rounded font-semibold uppercase hover:bg-blue-700 transition duration-300 text-sm"
                onClick={handleAddToMaps}
              >
                Tambahkan ke Peta
              </button>
            </div>

            <div className="mt-4 text-center text-gray-300">
              {resultLat && resultLng && (
                <p>
                  Koordinat Decimal:<br />
                  Latitude: {resultLat}, Longitude: {resultLng}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMSToDDCalculator;

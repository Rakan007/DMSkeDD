import React, { useState } from 'react';

const DMSToDDCalculator: React.FC = () => {
  const [latitude, setLatitude] = useState({ degrees: '', minutes: '', seconds: '' });
  const [longitude, setLongitude] = useState({ degrees: '', minutes: '', seconds: '' });
  const [resultLat, setResultLat] = useState<string>('');
  const [resultLng, setResultLng] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFunction: React.Dispatch<React.SetStateAction<any>>,
    field: string,
    type: 'latitude' | 'longitude'
  ) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    setFunction((prev: any) => ({ ...prev, [field]: value }));
  };

  const convertToDecimalDegrees = (deg: number, min: number, sec: number): number => {
    const dd = Math.abs(deg) + min / 60 + sec / 3600;
    return deg < 0 ? -dd : dd;
  };

  const handleConversion = () => {
    if (
      latitude.degrees !== '' && latitude.minutes !== '' && latitude.seconds !== '' &&
      longitude.degrees !== '' && longitude.minutes !== '' && longitude.seconds !== '' &&
      !isNaN(Number(latitude.degrees)) && !isNaN(Number(latitude.minutes)) && !isNaN(Number(latitude.seconds)) &&
      !isNaN(Number(longitude.degrees)) && !isNaN(Number(longitude.minutes)) && !isNaN(Number(longitude.seconds))
    ) {
      const latDD = convertToDecimalDegrees(
        Number(latitude.degrees),
        Number(latitude.minutes),
        Number(latitude.seconds)
      ).toFixed(8);

      const lngDD = convertToDecimalDegrees(
        Number(longitude.degrees),
        Number(longitude.minutes),
        Number(longitude.seconds)
      ).toFixed(8);

      setResultLat(latDD);
      setResultLng(lngDD);
    } else {
      alert('Masukkan semua nilai koordinat dengan benar (menit dan detik harus di antara 0-59)');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-gray-900 text-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-3 text-center">DMS ke DD</h2>
      <p className="mb-4 text-center text-gray-300 text-sm">Masukkan koordinat dalam DMS untuk dikonversi ke DD.</p>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-md font-medium mb-2 text-center">Lintang</h3>
          <input
            type="number"
            placeholder="Derajat (°)"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={latitude.degrees}
            onChange={(e) => handleInputChange(e, setLatitude, 'degrees', 'latitude')}
          />
          <input
            type="number"
            placeholder="Menit (')"
            className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={latitude.minutes}
            onChange={(e) => handleInputChange(e, setLatitude, 'minutes', 'latitude')}
          />
          <input
            type="number"
            placeholder='Detik (")'
            className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={latitude.seconds}
            onChange={(e) => handleInputChange(e, setLatitude, 'seconds', 'latitude')}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-md font-medium mb-2 text-center">Bujur</h3>
          <input
            type="number"
            placeholder="Derajat (°)"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={longitude.degrees}
            onChange={(e) => handleInputChange(e, setLongitude, 'degrees', 'longitude')}
          />
          <input
            type="number"
            placeholder="Menit (')"
            className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={longitude.minutes}
            onChange={(e) => handleInputChange(e, setLongitude, 'minutes', 'longitude')}
          />
          <input
            type="number"
            placeholder='Detik (")'
            className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            value={longitude.seconds}
            onChange={(e) => handleInputChange(e, setLongitude, 'seconds', 'longitude')}
          />
        </div>
      </div>
      <button
        className="w-full bg-green-600 text-black py-2 rounded font-bold uppercase hover:bg-green-700 transition duration-300 text-sm"
        onClick={handleConversion}
      >
        Konversi
      </button>
      <div className="mt-4 text-center">
        <h3 className="text-md font-medium mb-2">Hasil:</h3>
        <div className="mb-2">
          <label className="block text-gray-300 text-sm">Lat (DD):</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-green-400 border-none rounded text-center text-sm"
            value={resultLat}
            readOnly
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm">Lng (DD):</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-green-400 border-none rounded text-center text-sm"
            value={resultLng}
            readOnly
          />
                <p className="p-5 text-center text-gray-300 text-sm">note: DMS(Degrees Minute Second) ke DD(Degrees Decimal)</p>
        </div>
      </div>
    </div>
  );
};

export default DMSToDDCalculator;

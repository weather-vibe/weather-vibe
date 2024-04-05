export default function convertKelvinToCelsius(tempinKelvin: number) {
  const tempinCelsius = tempinKelvin - 273.15;
  return Math.floor(tempinCelsius);
}

/**
 * Egységes hiba kezelő segédfüggvény az API hibákhoz
 * @param error A keletkezett hiba
 * @param serviceName A szolgáltatás neve (pl. "Profil", "Napi rutin")
 * @param operation A művelet neve (pl. "lekérési", "frissítési")
 * @returns Soha nem tér vissza, mindig kivételt dob
 */
export const handleApiError = (error: any, serviceName: string, operation: string): never => {
  console.error(`${serviceName} ${operation} hiba:`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    statusText: error.response?.statusText
  });
  
  if (error.response?.data?.message) {
    throw new Error(`${serviceName} ${operation} hiba: ${error.response.data.message}`);
  }
  if (error.code === 'ECONNABORTED') {
    throw new Error('Időtúllépés történt. Kérjük ellenőrizze az internetkapcsolatát.');
  }
  if (!error.response) {
    throw new Error(`Nem sikerült kapcsolódni a szerverhez. Kérjük ellenőrizze az internetkapcsolatát.`);
  }
  throw new Error(`${serviceName} ${operation} hiba: ${error.message}`);
};

/**
 * Egyszerűbb hiba kezelő segédfüggvény a service-ek számára
 * @param error A keletkezett hiba
 * @param serviceName A szolgáltatás neve (pl. "Napi rutin", "Jegyzet")
 * @param operation A művelet neve (pl. "lekérési", "frissítési")
 * @returns Soha nem tér vissza, mindig kivételt dob
 */
export const handleServiceError = (error: any, serviceName: string, operation: string): never => {
  console.error(`${serviceName} ${operation} hiba:`, error);
  throw new Error(error.response?.data?.message || `Hiba történt a(z) ${serviceName} ${operation} során`);
}; 
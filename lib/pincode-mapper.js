export async function getPincodeData(pincode) {
  return {
    pincode,
    district: 'Sample District',
    state: 'Sample State',
    demographics: {
      population: 50000,
      farmers: 15000,
      workers: 20000,
      students: 8000,
      businesses: 2000
    }
  };
}

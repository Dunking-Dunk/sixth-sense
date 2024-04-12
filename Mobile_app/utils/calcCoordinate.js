// haversine formula

function toRad(x) {
    return x * Math.PI / 180;
  }


export const calcDistAtoB = (lat1, lon1, lat2, lon2) => {

    
    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon =  toRad(x2);

    const R = 6371; // km

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d
}
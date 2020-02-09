import { bitDepth10 } from './consts';
import secretKey from './secretKey';

export const loadInt = (item) => parseInt(localStorage.getItem(item), bitDepth10);

export const getCreditScoreValue = (creditScore) => {
    if (creditScore >= 750) {
        return 0.95;
    }
    if (creditScore >= 700 && creditScore < 750) {
        return 1;
    }
    if (creditScore >= 640 && creditScore < 700) {
        return 1.05;
    }
    if (creditScore < 640) {
        return 1.2;
    }
}

export function getLocation(accesKey) {
    const url = `https://ipinfo.io/json?token=${secretKey}`;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json.postal;
        })
  }
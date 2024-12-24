import {jwtDecode} from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};

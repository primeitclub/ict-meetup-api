import { CookieOptions } from "express";
import { envConfig } from "../config/env";

export function parseExpiryToSeconds(expiry: string) {
      const value = parseInt(expiry);
      const unit = expiry.replace(/[0-9]/g, '');

      switch (unit) {
            case 'm': return value * 60;        // minutes
            case 'h': return value * 60 * 60;   // hours
            case 'd': return value * 24 * 60 * 60; // days
            default: throw new Error('Invalid expiry format');
      }
}

export function parseExpiryToMs(expiry: string) {
      return parseExpiryToSeconds(expiry) * 1000;
}

export function setCookie(name: string, value: string, options: CookieOptions = { httpOnly: true, secure: envConfig.NODE_ENV === 'prod' || envConfig.NODE_ENV === 'dev', sameSite: 'strict' }) {
      return {
            name,
            value,
            options,
      };
}

export function clearCookie(name: string) {
      return {
            name,
            value: '',
            options: {
                  maxAge: 0,
            },
      };
}
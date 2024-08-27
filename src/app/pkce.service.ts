import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class PkceService {
  private codeVerifier: string | undefined;

  constructor() {}

  generateCodeVerifier(length: number = 128): string {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    this.codeVerifier = Array.from(randomValues)
      .map(byte => ('0' + byte.toString(16)).slice(-2))
      .join('');
    localStorage.setItem('code_verifier', this.codeVerifier)
    return this.codeVerifier;
  }

  generateCodeChallenge(): string {
  // Hash the code verifier using SHA-256
  const hash = sha256.arrayBuffer(this.codeVerifier as string);

  // Convert ArrayBuffer to a string
  const hashArray = Array.from(new Uint8Array(hash));
  const hashString = String.fromCharCode(...hashArray);

  // Encode the hash to base64
  const base64String = btoa(hashString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64String;
  }

  getCodeVerifier(): string | undefined   {
    return localStorage.getItem("code_verifier") as string;
  }
}

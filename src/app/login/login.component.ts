import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PkceService } from '../pkce.service';
import { globals } from '../app-configuration';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private pkceService: PkceService, private router: Router) { }

  login() {
    this.pkceService.generateCodeVerifier();
    const codeChallenge = this.pkceService.generateCodeChallenge();
    const queryParams = new URLSearchParams({
      response_type: 'code',
      response_mode: 'query',
      client_id: globals.clientId,
      state: 'xyz',
      scope: 'profile',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',//not needed, challenge method is always SHA256
      redirect_uri: window.location.origin + '/callback'
    }).toString();

    window.location.href = `${globals.ccaOnlineUrl}endcustomer/authorize?${queryParams}`;
  }
}
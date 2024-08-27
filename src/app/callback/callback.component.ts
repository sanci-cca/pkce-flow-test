import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PkceService } from '../pkce.service';
import { appConfig } from '../app.config';
import { globals } from '../app-configuration';

export interface AccessTokenResponse{
  access_token: string,
  token_type: string,
  expires_in: number
}

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pkceService: PkceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const authorizationCode = params['code'];
      this.exchangeCodeForToken(authorizationCode);
      console.log("code" + authorizationCode);
    });
  }

  async exchangeCodeForToken(code: string) {
    const codeVerifier = this.pkceService.getCodeVerifier() as string;
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', `${globals.kundenportalUrl}dashboard`)//this might not be necessary at all to pass
      .set('client_id', globals.clientId )
      .set('client_secret', globals.cliendSecret)
      .set('code_verifier', codeVerifier);

    this.http.post<AccessTokenResponse>('https://localhost/ccaonline/endcustomer/token', body)
      .subscribe(response => {
        console.log('Token Response:', response);
        window.location.href = `${globals.kundenportalUrl}twofaktorlogin#access_token=${response.access_token}&state=xyz&token_type=${response.token_type}&expires_in=${response.expires_in}}`;        
      }, error => {
        console.error('Token exchange failed', error);
      });
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "../models/user.model";

import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1";

  private apiKey = "AIzaSyDiLSiYjCZ3X9KagYqWViaKttmgNN5as6o";

  userToken: string;

  constructor(private httpClient: HttpClient) {
    this.readToken();
  }

  logOut() {
    localStorage.removeItem("token");
  }

  login(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };
    return this.httpClient
      .post(
        `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
        authData
      )
      .pipe(
        map((answer) => {
          console.log("login");
          this.saveToken(answer["idToken"]);
          return answer;
        })
      );
  }

  newUser(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };
    return this.httpClient
      .post(`${this.url}/accounts:signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((answer) => {
          this.saveToken(answer["idToken"]);
          return answer;
        })
      );
  }

  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let now = new Date();
    now.setSeconds(3600);

    localStorage.setItem("expire", now.getTime().toString());
  }

  readToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }

  isAutenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expire = Number(localStorage.getItem("expire"));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if (expireDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}

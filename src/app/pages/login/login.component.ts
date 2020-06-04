import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UsuarioModel } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";

import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: UsuarioModel = new UsuarioModel();

  remember: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.user.email = localStorage.getItem("email");
      this.remember = true;
    } else {
      this.user.email = "";
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor...",
    });

    Swal.showLoading();

    this.authService.login(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.close();

        if (this.remember) {
          localStorage.setItem("email", this.user.email);
        }

        this.router.navigate(["/home"]);
      },
      (err) => {
        console.log(err.error.error.message);
        Swal.fire({
          type: "error",
          title: "Login error",
          text: err.error.error.message,
        });
      }
    );
  }
}

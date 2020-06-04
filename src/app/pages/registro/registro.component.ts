import { Component, OnInit } from "@angular/core";
import { UsuarioModel } from "src/app/models/user.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  user: UsuarioModel;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UsuarioModel();
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor...",
    });

    Swal.showLoading();

    this.authService.newUser(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.close();
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

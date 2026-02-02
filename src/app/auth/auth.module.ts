import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import authRoutes from "./auth.routes";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [LoginComponent, RouterModule.forChild(authRoutes)],
})

export class AuthModule {
}
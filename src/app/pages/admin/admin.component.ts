import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router: Router, public afAuth: AngularFireAuth) {}

  public logout(): void {
    this.afAuth.signOut();
    this.router.navigate(['']);
  }
}

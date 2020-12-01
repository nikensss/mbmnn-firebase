import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm: FormGroup;
  public submitted: Boolean = false;
  public error: { code: number; message: string } = { code: -1, message: '' };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submitLogin() {
    const email = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      const authState = await this.afAuth.authState;
      console.log(`Auth state is: ${authState}`);
      this.router.navigate(['/admin']);
    } catch (ex) {
      console.log(ex);
      this.error.message = ex.toString();
    }
  }
}

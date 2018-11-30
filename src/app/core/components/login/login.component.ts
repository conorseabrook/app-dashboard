import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'app/services/auth.service';
import { AccountsService } from 'app/services/accounts.service';
import { StorageService } from 'app/services/storage.service';
import * as Sentry from '@sentry/browser';

declare let Web3: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  forms: {
    loginForm?: FormGroup;
    privateKeyForm?: FormGroup;
  } = {};
  promiseActionPrivateKeyForm;
  promiseActionLoginForm;
  showPassword;
  errorPrivateKeyForm;
  errorLoginForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private accountsService: AccountsService,
    private storageService: StorageService,
  ) {
    this.forms.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, this.validateEmail]),
      password: new FormControl(null, [Validators.required]),
    });
    this.forms.privateKeyForm = new FormGroup({
      privateKey: new FormControl(null, [
        Validators.required,
        this.validatePrivateKey,
      ]),
    });
  }

  ngOnInit() { }

  validatePrivateKey(control: AbstractControl) {
    try {
      const web3 = new Web3();
      console.log(web3.eth.accounts.privateKeyToAccount(control.value).address);
      return null;
    } catch (e) {
      return { 'Private key is invalid': control.value };
    }
  }

  validateEmail(control: AbstractControl) {
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailPattern.test(control.value)) {
      return { 'Email is invalid': control.value };
    }
    return null;
  }

  // Private key form

  async getAccount(): Promise<any> {
    try {
      this.errorPrivateKeyForm = false;
      const form = this.forms.privateKeyForm;

      if (form.invalid) {
        throw new Error('Fill all required fileds');
      }

      const { privateKey } = form.value;
      const address = this.authService.privateKeyToAccount(privateKey);
      this.storageService.set('secret', privateKey);
      this.storageService.set('token', this.authService.getToken());

      this.promiseActionPrivateKeyForm = new Promise(async (resolve, reject) => {
        const account = await this.accountsService.getAccount(address);
        console.log('[GET] Account: ', account);
        this.storageService.set('secret', privateKey);
        this.storageService.set('account', account);
        Sentry.configureScope(scope => {
          scope.setUser({ account });
        });
        this.accountsService._account.next(account);
        this.router.navigate(['/assets']);
        return account;
      });
    } catch (error) {
      console.error('[GET] Account: ', error);
      this.errorPrivateKeyForm = error;
      this.storageService.clear();
    }
  }

  // Login form

  async login(): Promise<any> {
    try {
      this.errorLoginForm = false;
      const form = this.forms.loginForm;

      if (form.invalid) {
        throw new Error('All fields are required');
      }

      const { email, password } = form.value;

      this.promiseActionLoginForm = new Promise(async (resolve, reject) => {
        const account = await this.authService.login(email, password);
        Sentry.configureScope(scope => {
          scope.setUser({ account });
        });
        return account;
      });
    } catch (error) {
      console.error('[LOGIN] Error: ', error);
      this.errorLoginForm = error;
    }
  }
}

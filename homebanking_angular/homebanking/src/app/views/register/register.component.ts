import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  Create, CreateSubscribeService } from 'src/app/service/createSubscribe';

@Component({
  selector: 'app-root',
  templateUrl:'./register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  ////objeto para criar registo
  utilizador: Create = { email: '', password: '', name: '' };

  constructor(private registerService: CreateSubscribeService, private router: Router) {}
//método que permite ir para o ecrã login
  sigIn(){
    this.router.navigate(['/home']);
  }
  //método register que passa como argumento o utilizador
  public register() {
    
    this.registerService.register(this.utilizador);
    
  }
}

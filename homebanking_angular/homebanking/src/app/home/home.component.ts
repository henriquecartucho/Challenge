import { Component } from '@angular/core';
import { LoginServiceService, Utilizador } from '../service/login-service.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //cria um objeto com as propriedades email e password
  
  utilizador:Utilizador={email: '', password:''}

  //construtor que recebe LoginServiceService responsável pelo serviço e o router que serve para redirecionar o ecrã 
  constructor(private loginService:LoginServiceService,private router: Router){}
    //método login que passa como argumento o utilizador
    public login(){
      this.loginService.login(this.utilizador)

    }
    //encaminha para o ecrã register
    navigateToRegister() {
      this.router.navigate(['/register']);
    }

}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root',
})
//declarar a class CreateSubscribeService responsável para registo
export class CreateSubscribeService {

  //construtor da classe, usa serviço HttpClient e o serviço Router como privado
  constructor(private http:HttpClient,private router: Router) {}

 //método que aceita um parâmetro utilizador do tipo Create
  register(utilizador: Create) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ' ' 
    });
    //body que contem o valor que vai ser enviado na rota para adicionar quantidade á conta
    const body = {
      email: utilizador.email,
      password: utilizador.password,
      name: utilizador.name
    };
    
  // Realiza uma solicitação HTTP POST para a URL definida em AppConstants.register, passando o objeto body em formato JSON.
    //executa o código dentro desta função quando a resposta é recebida.
    return this.http.post(AppConstants.register, JSON.stringify(body), { headers, responseType: 'text'}).subscribe(data => {
      var dados = JSON.parse(JSON.stringify(data)); // Obtém apenas o valor do token
     
      //encaminha para o ecrã home=login
      this.router.navigate(['/home']);
    });
  }
}
//interface que possui a propriedade email,password e name
export interface Create {
  email: string;
  password: string;
  name:string;
}

 


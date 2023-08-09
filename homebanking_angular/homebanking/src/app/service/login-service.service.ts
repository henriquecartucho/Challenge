import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
//declarar a class LoginServiceService responsável pelo login
export class LoginServiceService {
//construtor da classe, usa serviço HttpClient e o serviço Router como privado
  constructor(private http:HttpClient,private router: Router) {}
 //método que aceita um parâmetro utilizador do tipo Utilizador
  login(utilizador: Utilizador) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ' ' 
    });

  // Realiza uma solicitação HTTP POST para a URL de login defenido em app.constants.ts e passa os dados do utilizador em formato JSON
    return this.http.post(AppConstants.baseLogin, JSON.stringify(utilizador), { headers }).subscribe(data => {
      //na variavel token fica guardada a resposta o token após o login
      var token = JSON.parse(JSON.stringify(data)).token; 
      //guardar no localstorage o token que foi gerado
      localStorage.setItem("token", token);
     //reencaminhar para o ecrã account para o utilizador ver a sua conta
      this.router.navigate(['/account']);
    });
  }
}
//interface que possui a propriedade email e password 
export interface Utilizador {
  email: string;
  password: string;
}
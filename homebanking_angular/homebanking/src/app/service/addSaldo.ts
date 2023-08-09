import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root',
})
//declarar a class AddSaldoService responsável para adicionar saldo
export class AddSaldoService {
    
  //construtor da classe, usa serviço HttpClient e o serviço Router como privado
    constructor(private http: HttpClient, private router: Router) {}

    //método que aceita um parâmetro utilizador do tipo Add Saldo
    Depositar(utilizador: AddSaldo) {

      //guarda na variavel token o valor do token que foi gerado no login e que esta guardado no localstorage
      const token = localStorage.getItem('token'); 
  
      if (!token) {
        // se não existir token redireciona para o ecrã home=login
        this.router.navigate(['/home']); 
        return;
      }
     //Cria um objeto de cabeçalho HTTP que inclui o token no cabeçalho de autorização.
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      });
        //body que contem o valor que vai ser enviado na rota para adicionar quantidade á conta
      const body = {
        amount: utilizador.amount
      };
      

        //Realiza uma solicitação HTTP POST para a URL definida em AppConstants.addMoney, passando o objeto body e os cabeçalhos definidos.
      return this.http.request('post', AppConstants.addMoney, { body: JSON.stringify(body), headers, responseType: 'text' }).subscribe(
        data => {
          //armazena a resposta na variável dados
          var dados = ((data));
         // reencaminha o utilizador para o ecrã account
          this.router.navigate(['/account']);
        },
        error => {
          console.error('Erro ao remover dinheiro:', error);
        }
      );
    }
  }
  //interface que possui a propriedade amount
  export interface AddSaldo {
    amount: number;
  }

 
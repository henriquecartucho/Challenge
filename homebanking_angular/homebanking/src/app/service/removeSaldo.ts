import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root',
})
export class RemoveSaldoService {
    
  //construtor da classe, usa serviço HttpClient e o serviço Router como privado
    constructor(private http: HttpClient, private router: Router) {}
  // Método para remover saldo em que passa utilizador2 do tipo RemoveSaldo
    Remover(utilizador2: RemoveSaldo) {
      const token = localStorage.getItem('token'); // Obtenha o token do LocalStorage
  
      if (!token) {
       //se não houver token direciona para o ecrã home=login
        this.router.navigate(['/home']); 
        return;
      }
      //define os cabeçalhos para serem enviados, incluindo o token que esta no localstorage
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      });
   //body que contem o valor que vai ser enviado na rota para adicionar remover valor á conta
      const body = {
        amount: utilizador2.amount
      };
      
  

      //faz um pedido á api Delete e envia os dados e o cabeçalho
      return this.http.request('delete', AppConstants.removeMoney, { body: JSON.stringify(body), headers, responseType: 'text' }).subscribe(
        data => {
          //guarda na variável dados o valor da resposta
          var dados = JSON.parse(JSON.stringify(data));
          
        },
        error => {
          console.error('Erro ao remover dinheiro:', error);
        }
      );
    }
  }
  //interface que possui a propriedade amount
  export interface RemoveSaldo {
    amount: number;
  }

 
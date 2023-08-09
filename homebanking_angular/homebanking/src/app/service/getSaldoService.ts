import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
//declarar a class SaldoService responsável para ver o saldo
export class SaldoService {
   //construtor da classe, usa serviço HttpClient e o serviço Router como privado
  constructor(private http: HttpClient, private router: Router) {}


  getSaldo() {
    //guarda na variavel token o valor do token guardado no localstorage
    const token = localStorage.getItem('token');

    if (!token) {
      //se não houver token direciona para o ecrã home=login
      this.router.navigate(['/home']);
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    //faz um pedido get para o url mencionado e espera a reposta do tipo GetSaldo
    return this.http.get<GetSaldo>(AppConstants.moneyAccount, { headers });
   
  }
}
//interface que possui a propriedade saldo
export interface GetSaldo {
  saldo: number;
}

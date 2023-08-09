import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddSaldo, AddSaldoService } from 'src/app/service/addSaldo';
import {  GetSaldo, SaldoService } from 'src/app/service/getSaldoService';
import { RemoveSaldo, RemoveSaldoService } from 'src/app/service/removeSaldo';


@Component({
  selector: 'app-root',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  //objeto para adicionar saldo
  utilizador: AddSaldo = { amount: 0};
  //objeto para ver saldo
  saldo:GetSaldo={saldo:0};
  //objeto para remover saldo
  utilizador2:RemoveSaldo={ amount: 0};
  //construtor com todos os serviços necessários
  constructor(private depositar:AddSaldoService, private remover:RemoveSaldoService,private getSaldoService: SaldoService, private router: Router){}
 //método que é chamado para obter o saldo
  ngOnInit() {
    this.getSaldo();
  }
  //método que remove o token quando fazemos logout e redireciona para o ecrã login
  Out(){
    localStorage.removeItem('token'); 
  this.router.navigate(['/home']); 
  }

  // Método para obter o saldo atual
  getSaldo() {
    this.getSaldoService.getSaldo().subscribe(
      (data: GetSaldo) => {
        // Atribui o saldo retornado pelo serviço à propriedade saldo
        this.saldo = data; 
      }
    );
  }
// Método para depositar saldo
  Depositar(){
    // Chama o método de depositar do serviço
    this.depositar.Depositar(this.utilizador)
    //faz refresh na página
    window.location.reload();
  }
   // Chama o método de remover do serviço
  Remover(){
    this.remover.Remover(this.utilizador2)
    //faz refresh na página
    window.location.reload();
  }
}
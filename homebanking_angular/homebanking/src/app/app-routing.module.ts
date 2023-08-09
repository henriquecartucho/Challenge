import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './views/account/account.component';



const routes: Routes = [
/*
{path: '',pathMatch: 'full', loadChildren:()=>import('src/app/views/account/account.module').then((m)=>m.AccountModule)},
 */
{path:'account',
  loadChildren:()=>import('./views/account/account.module').then((m)=>m.AccountModule)
},
{
  path:'register',
  loadChildren:()=>import('./views/register/register.module').then((m)=>m.RegisterModule)
},
{
path:'home',
loadChildren:()=>import('../app/home/home.module').then((m)=>m.HomeModule)
},
{
  path:'',
  loadChildren:()=>import('../app/home/home.module').then((m)=>m.HomeModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export class AppConstants {

    public static get baseServidor(): string{return "http://localhost:3000/"}

    public static get baseLogin():string{return this.baseServidor+ "login"}

    public static get moneyAccount():string{return this.baseServidor+"verSaldo"}

    public static get register():string{return this.baseServidor+ "add"}

    public static get addMoney():string{return this.baseServidor+ "adicionarSaldo"}

    public static get removeMoney():string{return this.baseServidor+ "retirarSaldo"}

}

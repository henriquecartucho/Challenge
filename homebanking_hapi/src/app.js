'use strict';

const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const hapiAuthJwt2 = require('hapi-auth-jwt2'); 




const SECRET ='henrique';

//define as constantes para os caminhos de cada ficheiro
const DATA_FOLDER = path.join(__dirname, 'json_files');
const DATA_FILE = path.join(DATA_FOLDER, 'users.json');
const TOKENS_FILE = path.join(DATA_FOLDER, 'tokens.json'); 
const ACCOUNTS_FILE = path.join(DATA_FOLDER, 'accounts.json');
const USERS_FILE = path.join(DATA_FOLDER, 'users.json');

// esta função serve para criar uma pasta nova caso não exista
const createDataFolderIfNotExists = () => {
    if (!fs.existsSync(DATA_FOLDER)) {
        fs.mkdirSync(DATA_FOLDER);
    }
};

// Função para carregar dados dos saldos dos utilizadores
const loadAccountData = () => {
    try {
        const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


//esta função serve para carregar os utilizadores do ficheiro json
const loadUsers = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


const loadUsersSubscribe = () => {
    try {
        //guardo numa variável o valor lido do ficheiro
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        
        let users = JSON.parse(data);
        
       //verifico se a lista é vazia
       //se for vazia inicio um campo com id
        if (users.length === 0) {
            users = [{ id: 1 }];
        }

       //serve para ver qual o último id inserido
       
        let lastId = 0;
        users.forEach((user) => {
            if (user.id && !isNaN(user.id)) {
                //math.max compara o valor atual de lastid com o campo id, depois atualiza o valor do lastid
                lastId = Math.max(lastId, user.id);
            }
        });
       // serve para atribuir o proximo id á nova pessoa
       //assim sempre que criar uma nova pessoa, o id é criado sequencialmente
        let nextId = lastId + 1;
        users.forEach((user) => {
            if (!user.id || isNaN(user.id)) {
                user.id = nextId;
                nextId++;
            }
        });
        return users;
    } catch (err) {
        return [];
    }
};

// Função para salvar os dados dos utilizadores no arquivo JSON
const saveUsersSubscribe = (users) => {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(USERS_FILE, data, 'utf8');
};

// Função para carregar os dados das contas a partir do arquivo JSON
const loadAccountsSubscribe = () => {
    try {
        const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};
//criar uma conta nova sempre que o registo é novo
// Função para salvar os dados das contas no arquivo JSON
const saveAccountsSubscribe = (accounts) => {
    const data = JSON.stringify(accounts, null, 2);
    fs.writeFileSync(ACCOUNTS_FILE, data, 'utf8');
};

//função para a inicializar o servidor
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            //o cors serve para controlar o acesso
            cors: {
                origin: ['*'],
                //permite que o servidor verifique o token enviado pelo cliente
                additionalHeaders: ['x-access-token']
            }
        }
    });



const validate = async (decoded, request, h) => {
    //guarda em users os utilizadores
    const users = loadUsers();
    //procura um utilizador com o id que vem do token
    const user = users.find((user) => user.id === decoded.userId);
    //verifica se o utilizador foi encontrado ou não
    if (!user) {
        //se não for a validação é falsa
        return { isValid: false };
    }
//se for verdade a validação é bem sucedida
    return { isValid: true };
};


await server.register(require('hapi-auth-jwt2'));

//cria uma estratégia de autenticação jwt
server.auth.strategy('jwt', 'jwt', {
    //define uma chave secreta para assinar e verificar os tokens
    key: SECRET,
    verifyOptions: {
        //define o algoritmo de criptografia HS256 
        algorithms: ['HS256']
    },
    //chama a função validate para validar o token
    validate: validate 
});
//coloca todas as rotas por defeito a necessitar de autenticação
server.auth.default('jwt');
//rota responsável por criar um novo registo
// e criar uma conta nova para utilizador
server.route({
    method: 'POST',
    path: '/add',
    handler: (request, h) => {
        const { email, password, name } = request.payload;
        //// Carrega a lista de utilizadores e contas
        let users = loadUsersSubscribe();
        let accounts = loadAccountsSubscribe();
       
        //verifico se existe utilizadores
        const existingUser = users.find((user) => user.email === email);
        //se existir então erro
        if (existingUser) {
            return h.response('Utilizador já registado.').code(409);
        }

       //verifica o maior id dentro dos existentes e atualiza o valor no lastid 
        let lastId = 0;
        users.forEach((user) => {
            if (user.id && !isNaN(user.id)) {
                lastId = Math.max(lastId, user.id);
            }
        });
        //atribui um novo id ao novo utilizador
        const newUserId = lastId + 1;
        //cria um novo utilizador com os campos que recebe e por fim guarda no documento users.json
        const newUser = { id: newUserId, email, password, name };
        users.push(newUser);
        saveUsersSubscribe(users);

        //cria uma conta no ficheiro account.json com o id atribuído ao novo registo de utilizador
        //guarda a nova conta
        const newAccount = { id: newUserId, saldo: 0 };
        accounts.push(newAccount);
        saveAccountsSubscribe(accounts);

        return h.response('Utilizador criado com sucesso.').code(201);
    },
    options: {
        auth: false,
        payload: {
            parse: true
        }
    }
});

// Rota responsável pelo login
server.route({
    method: 'POST',
    path: '/login',
    handler: (request, h) => {
        //extrai os dados vindos do request
        const { id, email, password } = request.payload;
         // Carrega a lista de utilizadores
        const users = loadUsers();
        // Encontra o utilizador com o email fornecido
        const user = users.find((user) => user.email === email);
       // Verifica se o utilizador foi encontrado
        if (!user) {
            return h.response('Utilizador não encontrado.').code(401);
        }
        // Verifica se a senha fornecida corresponde à senha do utilizador
        if (user.password === password) {
            // Gera um token JWT com o ID do utilizador que expira em 5min
            const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '300s' });
            // Carrega a lista de tokens            
            const tokens = loadTokens();
            //verifica se existe algum token
            const existingTokenIndex = tokens.findIndex((t) => t.id === user.id);
        
            if (existingTokenIndex !== -1) {
                // Substituir o token existente pelo novo token
                tokens[existingTokenIndex].token = token;
            } else {
                // Adicionar um novo objeto ao array de tokens
                tokens.push({ id: user.id, token });
            }
        // Salva a lista atualizada de tokens em um arquivo tokens.json
            fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
            
            //retorna uma mensagem, a autenticação e o token criado
            return h.response({ message: 'Login realizado com sucesso.', auth: true, token }).code(200)
                .header('x-access-token', token);
        } else {
            return h.response('Credenciais inválidas.').code(401);
        }
    },
    options: {
        auth: false,
        payload: {
            parse: true
        }
    }
});
//carrega os tokens do documento tokens,json
const loadTokens = () => {
    try {
        const data = fs.readFileSync(TOKENS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

//rota responsável por adicionar valor á conta do utilizador autenticado
server.route({
    method: 'POST',
    path: '/adicionarSaldo',
    handler: (request, h) => {
        // Extrai o ID do utilizador autenticado a partir dos dados de autenticação
        const userId = request.auth.credentials.userId;
        // Extrai o valor do saldo a ser adicionado do corpo da solicitação e converte para número
        const amount = parseFloat(request.payload.amount); // Converter para número
        // Verifica se o valor de 'amount' é um número válido
        if (isNaN(amount)) {
            return h.response('Valor de amount inválido.').code(400);
        }
        // Carrega os dados das contas
        const accounts = loadAccountData();
        // Procura a conta do utilizador autenticado
        const userAccount = accounts.find((account) => account.id === userId);

        if (!userAccount) {
            return h.response('Conta do utilizador não encontrada.').code(404);
        }

        // Adicionar o valor ao saldo do utilizador
        userAccount.saldo += amount;

        // Atualizar o arquivo de contas com os novos dados
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
        // Retorna uma resposta de sucesso
        return h.response({ message: 'Saldo adicionado com sucesso.' }).code(200);
    },
    options: {
        auth: {
            mode: 'required',
            strategy: 'jwt'
        },
        payload: {
            parse: true
        }
    }
});


//rota responsável por retirar valor da conta do utilizador
server.route({
    method: 'DELETE',
    path: '/retirarSaldo',
    handler: (request, h) => {
        // Extrai o ID do utilizador autenticado a partir dos dados de autenticação
        const userId = request.auth.credentials.userId;
        // Extrai o valor da quantidade a ser retirado do corpo da solicitação
        const amount = request.payload.amount;
        // Carrega os dados das contas
        const accounts = loadAccountData();
        //procura pela conta do utilizador autenticado
        const userAccountIndex = accounts.findIndex((account) => account.id === userId);
        // Verifica se a conta foi encontrada
        if (userAccountIndex === -1) {
            return h.response('Conta do utilizador não encontrada.').code(404);
        }
        // guarda na variável a conta do utilizador
        const userAccount = accounts[userAccountIndex];
        //se o valor que quer retirar for maior do que o que tem na conta
        //então não permite fazer operação
        if (userAccount.saldo - amount < 0) {
            return h.response('Saldo insuficiente para a operação.').code(400);
        }
        //retira o saldo da conta
        userAccount.saldo -= amount;
        // Atualiza o arquivo de contas com os novos dados
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
         // Retorna uma resposta de sucesso
        return h.response({ message: 'Saldo retirado com sucesso.' }).code(200);
    },
    options: {
        auth: {
            mode: 'required',
            strategy: 'jwt'
        },
        payload: {
            parse: true
        }
    }
});
//rota responsável por ver o saldo do utilizador autenticado
server.route({
    method: 'GET',
    path: '/verSaldo',
    handler: (request, h) => {
        // Extrai o ID do utilizador autenticado a partir dos dados de autenticação
        const userId = request.auth.credentials.userId;
        // Carrega os dados das contas
        const accounts = loadAccountData();
        //procura pela conta do utilizador autenticado
        const userAccount = accounts.find((account) => account.id === userId);
        //se não encontrar lança erro
        if (!userAccount) {
            return h.response('Conta do utilizador não encontrada.').code(404);
        }
        //se encontrar retorna o valor na conta
        return h.response({ saldo: userAccount.saldo }).code(200);
    },
    options: {
        auth: {
            mode: 'required',
            strategy: 'jwt'
        }
    }
});

    //tenta iniciar o servidor, caso não dê certo lança o erro
    try {
        await server.start();
        console.log(`Servidor em: ${server.info.uri}`);
        createDataFolderIfNotExists();
    } catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
};



//inicia o servidor
init();
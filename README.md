# User Management and Blogging API

Esta é uma API para gerenciamento de usuários e blogging. A API permite criar, atualizar, excluir e visualizar usuários, posts, categorias e comentários. Além disso, a API inclui a capacidade de upload de imagens.

## Índice

- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/User-Management-and-Blogging-API.git
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd User-Management-and-Blogging-API
    ```
3. Instale as dependências:
    ```sh
    npm install
    ```

## Configuração do Banco de Dados

1. Certifique-se de ter o MySQL instalado e em execução.
2. Crie um banco de dados chamado `miniProjecto`.
3. Importe a estrutura e os dados do banco de dados utilizando o arquivo `miniprojecto.sql`:
    ```sh
    mysql -u root -p miniProjecto < miniprojecto.sql
    ```
4. Ajuste as configurações de conexão com o banco de dados no arquivo `config/db.js` se necessário:
    ```js
    const connection = mysql2.createConnection({
        host: 'localhost',
        database: 'miniProjecto',
        user: 'root',
        password: ''
    });
    ```

## Uso

1. Inicie o servidor:
    ```sh
    node index.js
    ```
2. Acesse a aplicação em seu navegador:
    ```
    http://localhost:3000
    ```

## API Endpoints

### Gestão de Usuários

- **Criar Usuário**
  - **Endpoint**: `/api/access/createUser`
  - **Método**: POST
  - **Descrição**: Cria um novo usuário. Aceita o upload de uma imagem.
  - **Exemplo de Requisição**:
    ```sh
    curl -X POST -F "imagen=@caminho/para/imagem.jpg" -F "username=nome" -F "email=email@example.com" -F "password=senha" -F "role=user" http://localhost:3000/api/access/createUser
    ```

- **Ver Usuário(s)**
  - **Endpoint**: `/api/access/:id/:username`
  - **Método**: GET
  - **Descrição**: Obtém informações de um usuário específico ou de todos os usuários se o solicitante for um admin.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/access/1/nomeDeUsuario
    ```

- **Atualizar Usuário**
  - **Endpoint**: `/api/access/update/:id/:name`
  - **Método**: PUT
  - **Descrição**: Atualiza as informações de um usuário. Aceita o upload de uma nova imagem.
  - **Exemplo de Requisição**:
    ```sh
    curl -X PUT -F "imagen=@caminho/para/novaImagem.jpg" -F "username=novoNome" -F "email=novoEmail@example.com" -F "password=novaSenha" -F "role=novoRole" http://localhost:3000/api/access/update/1/nomeDeUsuario
    ```

- **Deletar Usuário**
  - **Endpoint**: `/api/access/delete/:id/:username`
  - **Método**: DELETE
  - **Descrição**: Deleta um usuário específico e sua imagem associada.
  - **Exemplo de Requisição**:
    ```sh
    curl -X DELETE http://localhost:3000/api/access/delete/1/nomeDeUsuario
    ```

### Gestão de Publicações

- **Criar Post**
  - **Endpoint**: `/api/post/newPost/:id/:nombre`
  - **Método**: POST
  - **Descrição**: Cria uma nova publicação. Aceita o upload de uma imagem.
  - **Exemplo de Requisição**:
    ```sh
    curl -X POST -F "imagen=@caminho/para/imagem.jpg" -F "title=tituloDoPost" -F "content=conteudoDoPost" -F "categories=categoria1,categoria2" http://localhost:3000/api/post/newPost/1/nomeDeUsuario
    ```

- **Ver Post por Título**
  - **Endpoint**: `/api/post/view/:title`
  - **Método**: GET
  - **Descrição**: Obtém uma publicação específica pelo título.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/post/view/tituloDoPost
    ```

- **Ver Posts do Usuário**
  - **Endpoint**: `/api/post/view/:user/myposts`
  - **Método**: GET
  - **Descrição**: Obtém todas as publicações do usuário.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/post/view/nomeDeUsuario/myposts
    ```

- **Ver Posts da Comunidade**
  - **Endpoint**: `/api/post/view/communityposts`
  - **Método**: GET
  - **Descrição**: Obtém todas as publicações da comunidade.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/post/view/communityposts
    ```

- **Atualizar Post**
  - **Endpoint**: `/api/post/update/:id/:codePost`
  - **Método**: PUT
  - **Descrição**: Atualiza uma publicação específica.
  - **Exemplo de Requisição**:
    ```sh
    curl -X PUT -F "imagen=@caminho/para/novaImagem.jpg" -F "title=novoTitulo" -F "content=novoConteudo" -F "categories=novoCategoria1,novoCategoria2" http://localhost:3000/api/post/update/1/codeDoPost
    ```

- **Deletar Post**
  - **Endpoint**: `/api/post/delete/:id/:user_id`
  - **Método**: DELETE
  - **Descrição**: Deleta uma publicação específica e sua imagem associada.
  - **Exemplo de Requisição**:
    ```sh
    curl -X DELETE http://localhost:3000/api/post/delete/1/idDoUsuario
    ```

### Gestão de Categorias

- **Ver Todas as Categorias**
  - **Endpoint**: `/api/access/:id/:username/allCategories`
  - **Método**: GET
  - **Descrição**: Obtém todas as categorias se o solicitante for um admin.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/access/1/nomeDeUsuario/allCategories
    ```

- **Criar Categoria**
  - **Endpoint**: `/api/access/:id/:username/createCategory`
  - **Método**: POST
  - **Descrição**: Cria uma nova categoria.
  - **Exemplo de Requisição**:
    ```sh
    curl -X POST -F "name=nomeDaCategoria" http://localhost:3000/api/access/1/nomeDeUsuario/createCategory
    ```

- **Atualizar Categoria**
  - **Endpoint**: `/api/access/:id/:username/categories/:idCategory`
  - **Método**: PUT
  - **Descrição**: Atualiza uma categoria específica.
  - **Exemplo de Requisição**:
    ```sh
    curl -X PUT -F "name=novoNomeDaCategoria" http://localhost:3000/api/access/1/nomeDeUsuario/categories/idDaCategoria
    ```

- **Deletar Categoria**
  - **Endpoint**: `/api/access/:id/:username/categories/:idCategory`
  - **Método**: DELETE
  - **Descrição**: Deleta uma categoria específica.
  - **Exemplo de Requisição**:
    ```sh
    curl -X DELETE http://localhost:3000/api/access/1/nomeDeUsuario/categories/idDaCategoria
    ```

### Gestão de Comentários

- **Ver Todos os Comentários de uma Publicação**
  - **Endpoint**: `/api/post/:post_id/comments`
  - **Método**: GET
  - **Descrição**: Obtém todos os comentários de uma publicação específica.
  - **Exemplo de Requisição**:
    ```sh
    curl -X GET http://localhost:3000/api/post/idDoPost/comments
    ```

- **Criar Comentário**
  - **Endpoint**: `/api/post/:post_id/createComment/:user_id`
  - **Método**: POST
  - **Descrição**: Cria um novo comentário em uma publicação específica.
  - **Exemplo de Requisição**:
    ```sh
    curl -X POST -F "content=conteudoDoComentario" http://localhost:3000/api/post/idDoPost/createComment/idDoUsuario
    ```

- **Atualizar Comentário**
  - **Endpoint**: `/api/post/:post_id/comment/:id/:user_id`
  - **Método**: PUT
  - **Descrição**: Atualiza um comentário específico.
  - **Exemplo de Requisição**:
    ```sh
    curl -X PUT -F "content=novoConteudoDoComentario" http://localhost:3000/api/post/idDoPost/comment/idDoComentario/idDoUsuario
    ```

- **Deletar Comentário**
  - **Endpoint**: `/api/post/:post_id/comment/:id/:user_id`
  - **Método**: DELETE
  - **Descrição**: Deleta um comentário específico.
  - **Exemplo de Requisição**:
    ```sh
    curl -X DELETE http://localhost:3000/api/post/idDoPost/comment/idDoComentario/idDoUsuario
    ```

## Estrutura do Projeto

```plaintext
User-Management-and-Blogging-API/
├── config/
│   ├── config.js
│   ├── db.js
│   ├── multer.js
├── routes/
│   ├── bloggingRouter.js
├── src/
│   ├── helper.js
│   ├── userController.js
├── uploads/
│   ├── photoUser/
│   ├── image/
├── index.js
├── swagger-output.json
├── README.md
└── package.json

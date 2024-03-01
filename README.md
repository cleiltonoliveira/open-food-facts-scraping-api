

# Open Food Facts Scraping API



Esta é uma API em Nest que realiza scraping do site Open Food Facts possibilitando a busca de um produto específico através do seu código ou uma lista de produtos.

A API utiliza o Puppeteer que é um biblioteca Node.js que fornece uma API para controle do browser Chrome/Chromium através do protolo DevTools [(Saiba mais)](https://pptr.dev/).

*******
Tabelas de conteúdo
1. [Endpoints](#endpoints)  
1.1 [Obter Produtos](#obterProdutos)  
1.2 [Obter Produto por ID ](#obterProdutoPorId)
2. [Desafios de construção](#desafios)
3. [Como executar localmente](#executarLocal)
4. [Especificação Swagger (OAS 3.0)](#specSwagger)
*******
Segue abaixo a descrição dos endpoints da API, bem como o seu comportamento.
## Endpoints
<div id='endpoints'/> 

### Obter Produtos
<div id='obterProdutos'/> 

Endpoint para obter uma lista de produtos baseado na classificação NOVA e/ou Nutri-Score.  
[Classificação NOVA (Saiba mais)](https://br.openfoodfacts.org/nova-groups).  
[Classificação NutriScore (Saiba mais)](https://br.openfoodfacts.org/nutrition-grades).  

#### Requisição

`GET /api/v1/public/produtos`

#### Parâmetros da Consulta

- `nova` (string, opcional): Filtra produtos de acordo com a classificação NOVA informada.
- `nutrition` (string, opcional): Filtra produtos de acordo com a classificação Nutri-Score informada.  
**Caso nenhum parâmetro seja enviado a API retornará uma lista com todos os produtos.**

#### Resposta

##### Exemplo de corpo da resposta para `GET /api/v1/public/produtos/?nova=1&nutrition=A`

```json
[
    {
      "id": "8011780000922",
      "name": "Nudeln Spaghetti - Riscossa - 500g",
      "nutrition": {
        "score": "A",
        "title": "Qualidade nutricional muito boa"
      },
      "nova": {
        "score": 1,
        "title": "Alimentos não processados ​​ou minimamente processados"
      }
    },
    {
      "id": "8005121000535",
      "name": "Gomiti 53 - Divella - 500 g - 17.6 oz (1 lb 1 oz 9 dr)",
      "nutrition": {
        "score": "A",
        "title": "Qualidade nutricional muito boa"
      },
      "nova": {
        "score": 1,
        "title": "Alimentos não processados ​​ou minimamente processados"
      }
    }
]
```

### Obter Produto por ID
<div id='obterProdutoPorId'/> 

Endpoint para obter um produto através do seu ID.

#### Requisição

`GET /api/v1/public/produtos/{productId}`

#### Parâmetros da Consulta

- `productId` (string, obrigatório): Busca um produto através do seu ID de identificação.

#### Resposta

##### Exemplo de corpo da resposta para `GET /api/v1/public/produtos/8412170038028`

```json
{
    "title": "Noglut Crispy Break Cacao - Santiveri - 100 g",
    "quantity": "100 g",
    "ingredients": {
        "list": [
            ": Harina de arroz, harina de maíz, cacao desgrasado en polvo 15%, azúcar moreno de caña integral.",
            "Vestígios: Soja"
        ],
        "hasPalmOil": false,
        "isVegan": true,
        "isVegetarian": true
    },
    "nutrition": {
        "score": "A",
        "values": [
            [
                "low",
                "Gorduras/lípidos em quantidade baixa (2.5%)"
            ],
            [
                "low",
                "Gorduras/lípidos/ácidos gordos saturados em quantidade baixa (1.3%)"
            ],
            [
                "high",
                "Açúcares em quantidade elevada (16.1%)"
            ],
            [
                "low",
                "Sal em quantidade baixa (0.147%)"
            ]
        ],
        "servingSize": "1 tostada 5.5 g",
        "data": {
            "Energia": {
                "per100g": "1.578 kj(373 kcal)",
                "perServing": "86,8 kj(20 kcal)"
            },
            "Gorduras/lípidos": {
                "per100g": "2,5 g",
                "perServing": "0,138 g"
            },
            "Carboidratos": {
                "per100g": "76,4 g",
                "perServing": "4,2 g"
            },
            "Fibra alimentar": {
                "per100g": "5,6 g",
                "perServing": "0,308 g"
            },
            "Proteínas": {
                "per100g": "8,4 g",
                "perServing": "0,462 g"
            },
            "Sal": {
                "per100g": "0,148 g",
                "perServing": "0,008 g"
            }
        },
        "nova": {
            "score": 3,
            "title": "Alimentos processados"
        }
    }
}
```

## Desafios encontrados na construção desta API
<div id='desafios'/> 

O Puppeteer necessita de uma instância de browser para realizar uma requisição a uma página, assim, um desafio encontrado consiste em como lidar em cenários de várias requisições. Utilizar apenas uma instância de browser e deixar o Puppeteer criar várias páginas nessa instância pode gerar problemas, uma vez que o número de paginas que o browser conseguirá suportar não é conhecido e seria um cenário complicado para tratamento de erros.

Por outro lado, criar uma instância de browser para cada requisição pode aumentar o custo de processamento e latência de resposta ao cliente.

Dessa forma, considerando o acima disposto, a abordagem adotada consistiu na criação de um pool de browsers onde as instâncias são obtidas para atender a solicitação e em seguida é devolvida ao pool ficando disponível para as próximas solicitações. Isso evita por exemplo que uma instância de browser seja criada e destruida a cada requisição do cliente, reduzindo o custo de processamento da API.  
Nesse cenário, caso chegue uma requisição e não existir nenhuma instância disponível no pool, a API foi configurada para criar automaticamente novas instâncias para atender a demanda. Apesar disso, o pool não ultrapassará o número máximo de instâncias conforme definido ao iniciar a aplicação.

## Executando a API localmente
<div id='executarLocal'/> 

## Pré-requisitos

- Node.js e npm instalados na sua máquina. Você pode baixá-los e instalá-los a partir do [site oficial do Node.js](https://nodejs.org/).
- Git instalado na sua máquina. Você pode baixá-lo e instalá-lo a partir do [site oficial do Git](https://git-scm.com/).

### Clonando o Repositório

Abra o terminal e execute o seguinte comando para clonar o repositório:

```bash
git clone https://github.com/cleiltonoliveira/open-food-facts-scraping-api.git
```

### Instalando Dependências

Navegue até o diretório do projeto e execute o seguinte comando para instalar as dependências:

```bash
cd open-food-facts-scraping-api
npm install
```


### Executando o aplicativo

Após a instalação das dependências, execute um dos seguites comandos para iniciar o servidor:

```bash
# desenvolvimento
$ npm run start

# watch mode
$ npm run start:dev
```
Por padrão a aplicação será iniciada com o valor máximo de 2 instâncias de browser no pool, para alterar esse valor, inicie a aplicação setando o valor da variable de ambiente MAX_BROWSER_POOL_SIZE para o valor desejado. ex:

```bash
$ MAX_BROWSER_POOL_SIZE=10 npm run start
```
A aplicação escutará requisições em http://localhost:3000/  
ex: http://localhost:3000/api/v1/public/produtos/8412170038028

Por padrão o app utiliza a porta 3000 para funcionar, caso deseje alterar, modifique a variáel PORT no ambiente de execução.

## Especificação Swagger OAS 3.0
<div id='specSwagger'/> 

A API possui a especificação Swagger gerada através da integração com a biblioteca @nestjs/swagger. A biblioteca permite que a especifição seja gerada através de decorators nos controllers e nos objetos, e disponibiliza a especificação em uma rota da API, sendo por padrão http://localhost:3000/api.

A questão é que para ter acesso ao Swagger é necessário executar a aplicação para ter acesso a rota na API.

Assim, para facilitar o acesso ao Swagger, criei um workflow no GitHub Actions que é acionado sempre que um push é realizado na branch main. O workflow realiza o build do projeto e gera o arquivo Swagger, o qual é disponibilizado para GitHub Pages na branch docs.

Link do Git Pages: [https://cleiltonoliveira.github.io/open-food-facts-scraping-api/](https://cleiltonoliveira.github.io/open-food-facts-scraping-api/)
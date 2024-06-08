
# Preparando Banco

1- Caso não possua o mongodb instalado, pode se utilizar docker para gerar uma instância:

 **Run Docker Compose:**  
 ```bash
 docker compose up
 ```

2 - Execute Script Python para inserir dados no banco:

**Instale as dependecias do Python:**  
```bash
pip install -r requirements.txt
```

**Rode script python:**  
```bash
python insere_produtos.py
```


# Como Executar:

1. **Instale as Dependências:**  
   Execute o seguinte comando para instalar todas as dependências necessárias:
   ```bash 
   npm install 
   ```

2. **Inicie o Servidor Express:**  
   Em um terminal, execute o servidor Express com o comando:
   ```bash
   node server.js
   ```

3. **Execute o React:**  
   Para iniciar o ambiente de desenvolvimento React, utilize o comando:
   ```bash 
   npm run dev
   ```



# React + TypeScript + Vite

Este modelo fornece uma configuração mínima para usar React no Vite com HMR e algumas regras ESLint.

Atualmente, existem dois plugins oficiais disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Expansão da Configuração ESLint

Se você estiver desenvolvendo uma aplicação de produção, recomendamos atualizar a configuração para habilitar regras de lint sensíveis ao tipo:

- Configure a propriedade `parserOptions` no nível superior desta forma:

```js
export default {
  // outras regras...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Substitua `plugin:@typescript-eslint/recommended` por `plugin:@typescript-eslint/recommended-type-checked` ou `plugin:@typescript-eslint/strict-type-checked`
- Opcionalmente, adicione `plugin:@typescript-eslint/stylistic-type-checked`
- Instale [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) e adicione `plugin:react/recommended` e `plugin:react/jsx-runtime` à lista `extends`
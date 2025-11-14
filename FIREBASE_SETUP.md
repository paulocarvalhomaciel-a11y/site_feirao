# 🔥 Como Configurar o Firebase para Ranking Global

## Passo 1: Criar Projeto Firebase (GRATUITO)

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `cecal-cultura` (ou qualquer nome)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## Passo 2: Ativar Realtime Database

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha localização: **Estados Unidos (us-central1)** (mais rápido no Brasil)
4. Modo de segurança: Escolha **"Modo de teste"** por enquanto
5. Clique em **"Ativar"**

## Passo 3: Configurar Regras de Segurança

Na aba **"Regras"**, substitua por:

```json
{
  "rules": {
    "rankings": {
      ".read": true,
      ".write": true,
      "$rankingId": {
        ".validate": "newData.hasChildren(['name', 'level', 'points', 'timestamp']) && newData.child('name').isString() && newData.child('level').isNumber() && newData.child('points').isNumber()"
      }
    }
  }
}
```

Clique em **"Publicar"**

## Passo 4: Obter Configurações

1. Clique no ícone de **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Vá em **"Configurações do projeto"**
3. Role até **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. Apelido do app: `Jogo da Forca`
6. **NÃO marque** "Firebase Hosting"
7. Clique em **"Registrar app"**
8. **COPIE** o objeto `firebaseConfig` que aparece

Exemplo do que você vai copiar:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cecal-cultura.firebaseapp.com",
  databaseURL: "https://cecal-cultura-default-rtdb.firebaseio.com",
  projectId: "cecal-cultura",
  storageBucket: "cecal-cultura.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
```

## Passo 5: Atualizar o Código

Abra `Davi_8A.html` e substitua a seção `firebaseConfig` (por volta da linha 530) com os valores que você copiou:

```javascript
// SUBSTITUIR ESTAS LINHAS com seus valores do Firebase:
const firebaseConfig = {
    apiKey: "COLE_AQUI_SUA_API_KEY",
    authDomain: "COLE_AQUI_SEU_AUTH_DOMAIN",
    databaseURL: "COLE_AQUI_SEU_DATABASE_URL",
    projectId: "COLE_AQUI_SEU_PROJECT_ID",
    storageBucket: "COLE_AQUI_SEU_STORAGE_BUCKET",
    messagingSenderId: "COLE_AQUI_SEU_MESSAGING_SENDER_ID",
    appId: "COLE_AQUI_SEU_APP_ID"
};
```

## Passo 6: Testar

1. Salve o arquivo
2. Faça commit e push:
```bash
git add Davi_8A.html FIREBASE_SETUP.md
git commit -m "🔥 Adiciona Firebase para ranking global"
git push origin main
```

3. Aguarde 1-2 minutos para o GitHub Pages atualizar
4. Acesse seu site e teste o jogo
5. Salve um score e verifique no Firebase Console se apareceu em **Realtime Database > Data**

## ✅ Pronto!

Agora você tem um **ranking global em tempo real** que funciona para todos os jogadores!

### Vantagens do Firebase:
- ✅ **Gratuito** até 10GB de transferência/mês
- ✅ **Tempo real** - atualizações instantâneas
- ✅ **Confiável** - mantido pelo Google
- ✅ **Escalável** - suporta milhares de jogadores
- ✅ **Fácil** - sem necessidade de servidor próprio

### Melhorias Futuras (Opcional):

Para produção, ajuste as regras de segurança para evitar spam:

```json
{
  "rules": {
    "rankings": {
      ".read": true,
      ".write": "auth != null || (!root.child('rankings').child(newData.child('name').val()).exists() && newData.child('points').val() > 0)",
      "$rankingId": {
        ".validate": "newData.hasChildren(['name', 'level', 'points', 'timestamp']) && newData.child('name').isString() && newData.child('name').val().length > 0 && newData.child('name').val().length <= 15 && newData.child('level').isNumber() && newData.child('level').val() > 0 && newData.child('points').isNumber() && newData.child('points').val() > 0"
      }
    }
  }
}
```

## 🆘 Problemas?

- Se não aparecer nada no ranking, abra o Console do navegador (F12) e veja os logs
- Verifique se o `databaseURL` está correto e termina com `.firebaseio.com`
- Certifique-se de que as regras estão publicadas no Firebase

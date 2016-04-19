# adriatik

Pour installer le projet :
* Pour installer node, utilisez le packet manager de votre OS ou allez sur le site officiel de nodejs
* Pour installer gulp :
```
npm install -g gulp
```

Si vous avez des problèmes d'installation de gulp lié aux droits d'accès, ce peut être dû à un conflit lié à la version de nodejs installé.
Pour cela, installez nvm :

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash`

et seléctionnez si besoin la version de node à utiliser (via `nvm ls` puis `nvm use <version de node>`)


* Puis allez dans le répertoire du projet et tapez (ça peut être très long) :
```
npm install
``` 

Si vous avez un proxy, il faut le configurer dans npm :
```
npm config set proxy http://xxxx
```


Voici ensuite quelques commandes :
* ```gulp serve``` pour démarrer un server statique. Attention, il faut le redémarrer lorsqu'on ajoute des fichiers qui ne sont pas dans le répertoire de watch (par défaut ```src```, cf ```gulpfile.js/conf.base.watch```).
Les fichiers générés se trouvent dans le répertoire ```dist```
* ```npm test``` pour lancer les tests
* ```gulp``` pour créer une version compilée (minifée, uglify, etc...)
* ```./startSocketServer.sh``` pour lancer un serveur de messages en local (port 8001). Il faut alors changer la conf dans socket.js

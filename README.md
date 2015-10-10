# adriatik

Le projet a été généré avec http://yeoman.io et le générateur https://github.com/Swiip/generator-gulp-angular.

Pour installer le projet :
* Pour installer node, utilisez le packet manager de votre OS ou allez sur le site de nodejs
* Pour installer gulp et bower :
```
npm install -g gulp
npm install -g bower
```
* Puis allez dans le répertoire du projet et tapez :
```
npm install
bower install
```

Si vous avez un proxy, il faut le configurer dans npm :
```
npm config set proxy http://xxxx
```


Voici ensuite quelques commandes :
* ```gulp serve``` pour démarrer un server statique. Attention, il faut le redémarrer lorsqu'on ajoute des fichiers
* ```gulp test``` pour lancer les tests
* ```gulp dist``` pour créer une version compilée (minifiée, uglify, etc...)
* ```gulp test``` pour lancer 1 fois les tests
* ```gulp test:auto``` pour lancer les tests en continu avec un watch sur les fichiers

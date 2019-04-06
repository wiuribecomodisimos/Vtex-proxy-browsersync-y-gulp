# Desarrollo en Vtex

Agiliza el desarrollo en la plataforma Vtex por medio de

1. Proxy que simula la carga del sitio.
2. Compilación y mignificación de los archivos.
3. Linter

## Funcionamiento

Al navegar el proxy `localhost:3000` o  `https://localhost:3000` este cargara la tienda con todos sus archivos por defecto a no ser que en el directorio local `src` encuentre su remplazo, en caso de https permitir acceso a fuentes desconcidas.

El directorio local `.src` debe contener la estructura de directorios equivalente a el path raiz de Vtex ejemplo: `./src/arquivos/FILE.js` tambien es posible agrupar tipos de archivos en directorios ejemplo: `./src/arquivos/js/FILE.js`. convirtiendolo a `./arquivos/FILE.js`.

Nota: 
- Error al login, intentar hacer login con Facebook, Google acount.
- Los archivos se trabajaran en local igual sus cambios solo se realizan en este. SOLO LAS TAREAS ADMINISTRATIVAS AFECTAN EL ENTORNO REAL.

## Desarrollo

### Proxy

1. Renombrar el archivo `.env-conf` ->`.env` y configurarlo con los datos personales.

2. Ejecutar el entorno de prueba:

```bash

npm i
npm run watch

```

3. Abrir la URL del proxy por defecto: `localhost:3000` si esta en https: `https://localhost:3000/` y aceptar origenes desconocidos.

4. Al hacer los cambios estos se veran en vivo.

5. Una vez listos los cambios, subirlos manualmente por el administrador a la plataforma Vtex por medio del administrador.

## Producción
Listo todo!, generar todos los archivos mignificados, concatenados o en webpack:bundle para subirlos. 


1. Renombrar el archivo `.env-conf` ->`.env` y configurarlo con los datos personales.

Ejecutar:

```bash

npm i
npm start

```

En el directorio `./dist` se encuentra los archivos comprimidos bajo la misma estructura o en `./dis/min` el compilado de css y scripts.

## Prettier
Deshabilitar el prettier al inicio del archivo .js => `// prettier-ignore`

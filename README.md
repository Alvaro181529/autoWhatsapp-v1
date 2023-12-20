# autoWhatsapp
## Descripción

Con esta aplicacion se puede realizar automatizacion de nmensajes de whatsapp este permite solo archivos excel por el momento.

## Requisitos

* Node.js 16.x
* NPM 8.x

## Autores

* Alvaro181529

## Versionado

Versión actual: 0.0.2

## Instalación

1. Clona el repositorio
* `npm install`
2. Se instalaran las siguientes dependencias:
* `npm i rimraf`
* `npm i xlsx`
* `npm i qrcode` 
* `npm i whatsapp-web.js`
* `npm i electron`
* `npm i electron-packager`
3. Para correr el proyecto:
* `npm tun dev`
4. Para crear el ejecutable:
* `electron-packager . <nombre de la app> --platform=win32 --arch=x64 --icon <ubicacion del icono>`
* `electron-packager . AutoWhats --platform=win32 --arch=x64 --icon whatsappmobile_phone.ico`

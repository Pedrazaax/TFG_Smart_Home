Autor: Carlos Pedraza Antona

# TFG_Smart_Home - CLIENTE (FRONTEND)

Este proyecto está enfocado a la investigación en el grupo GSyA, dentro de la UCLM. El objetivo principal es desarrollar una aplicación web para la gestión de dispositivos IoT en el hogar, con el fin de poder hacer un estudio de la relacción entre el consumo, sostenibilidad con la seguridad de los dispositivos IoT.

## Ejecución en local

A continuación, se muestran los pasos a seguir para ejecutar en local el proyecto.

1. **Clonar el repositorio**

```bash
git clone https://github.com/usuario/TFG_Smart_Home.git
cd TFG_Smart_Home/MyHomeIQ
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar la aplicación**

```bash
ng serve
```

4. **Abrir en el navegador**

Abre tu navegador y navega a `http://localhost:4200`.

## Secciones de la aplicación

### Introducción

En esta sección se presenta la aplicación MyHomeIQ, destacando sus características principales como la gestión de dispositivos IoT, la seguridad garantizada, el almacenamiento en la nube y el procesamiento en tiempo real con inteligencia artificial.

### Gestión de Usuarios

Esta sección está destinada a los administradores y permite ver el listado de usuarios, crear nuevos usuarios, modificar usuarios existentes y eliminar usuarios.

### Gestión de Dispositivos

En esta sección, los usuarios pueden añadir nuevos dispositivos IoT, ver el estado de los dispositivos conectados, gestionar el estado de los dispositivos y recibir ayuda con inteligencia artificial.

### Análisis de Seguridad

Esta sección muestra los resultados de los análisis de seguridad, incluyendo todos los CVE (Common Vulnerabilities and Exposures) de los dispositivos conectados. Los usuarios pueden filtrar por dispositivo y por criticidad de la vulnerabilidad, y ver toda la información de cada CVE.

### Etiqueta de Seguridad

Muestra un resumen por categorías del número de vulnerabilidades por criticidad en cada una de ellas y también muestra el estado de seguridad actual de la casa.

### Etiqueta de Consumo

Proporciona información sobre el consumo energético de los dispositivos, incluyendo el consumo diario, mensual y anual. Además, muestra la potencia, la intensidad y la letra de consumo de la casa.

### Simulador de Consumo

Permite añadir dispositivos en un tiempo determinado para simular el consumo que tendrían y poder darle una etiqueta de consumo a la casa. Se puede hacer una simulación con datos genéricos o con el estado concreto de cada dispositivo.


# Project Title

Este proyecto esta enfocado a reducir el esfuerzo por parte de los desarrolladores al iniciar un nuevo proyecto, con el fin de eliminar de ejecutar tareas repetitivas en cada nuevo desarrollo, impactando directamente los tiempos de entrega. Este proyecto se encuentra licenciado bajo los términos de la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0).

## Demos

https://frontend-exo-template.vercel.app/

## Instalación

### Instalación Manual

#### a. Clonar el Repositorio

Se debe de comenzar por clonar el repositorio de la plantilla desde GitHub con el siguiente comando:

```bash
git clone https://github.com/Cszart/frontend-EXO-template
```

Una vez el repositorio es clonado ya se puede navegar al directorio de la plantilla:

```bash
cd Frontend_Template
```

#### b. Instalación de dependencias

Antes de poder probar la plantilla se debe asegurar que Node.js y NPM estén instalados en el sistema. Una vez se verificado se procede a instalar el proyecto:

```bash
yarn install
```

#### c. Configuración

Dentro del directorio del proyecto se debe crear un archivo .env donde se deben definir las variables de entorno del proyecto, la plantilla contiene un archivo .env.example que indica cuáles son las variables de entorno que se deben definir inicialmente.

#### d. Inicio del Servidor de Desarrollo:

Para iniciar el servidor de desarrollo se debe ejecutar el siguiente comando:

```bash
yarn dev
```

Esto iniciará el proyecto localmente en modalidad de desarrollador en la ruta: localhost:3000 se podrá acceder al proyecto ingresando esa dirección en un navegador web.

### Instalacion automatica

Si prefieres evitar el proceso de clonar el repositorio y configurar manualmente las variables de entorno, puedes utilizar el comando npx para crear y configurar automáticamente un nuevo proyecto basado en la plantilla EXO. Simplemente ejecuta el siguiente comando en tu terminal:

```bash
npx create-exo-frontend-template <nombre-del-proyecto>
```

Este comando creará un nuevo directorio con el nombre especificado y configurará automáticamente las variables de entorno necesarias. Luego, podrás iniciar el servidor de desarrollo con el comando yarn dev como se describe en los pasos anteriores.

## Testing

Abrir interfaz de Cypress con

```bash
  yarn cypress open
```

Luego E2E testing para probar los flujos, y seleccionar el navegador.

## Módulos preconfigurados

- **Autenticación y Autorización**: Ofrece interfaces gráficas para el registro de usuarios, inicio de sesión, recuperación de contraseñas y autenticación a través de redes sociales y billeteras digitales. Además de las interfaces, proporciona funciones lógicas para gestionar la autorización de usuarios según sus roles o permisos.

- **Gestión de Plantillas de Correos Electrónicos**: Permite a los desarrolladores crear, editar y visualizar estructuras HTML para la construcción de plantillas de correos electrónicos. Ofrece una interfaz gráfica para facilitar el diseño y personalización de las plantillas, junto con funciones lógicas para guardarlas. Es especialmente útil para diseñar correos electrónicos utilizados en diversas situaciones, como confirmación de identidad, recuperación de contraseña y marketing.

- **Sistema de Gestión de Aplicaciones**: Integra los dos módulos anteriores para formar un sistema completo de gestión de aplicaciones. Proporciona funciones lógicas para gestionar la autenticación y autorización de usuarios, así como para manejar la visualización y modificación de las plantillas de correos electrónicos. Además, incluye funciones para administrar los roles de los usuarios y asignarles funcionalidades específicas dentro de la aplicación.

Estos módulos preconfigurados ofrecen una base sólida para el desarrollo de aplicaciones web, simplificando tareas comunes y permitiendo a los desarrolladores concentrarse en crear funciones únicas y de valor añadido.

## Documentacion Adicional

[Documentacion](https://1drv.ms/w/s!As_36iplpjl7mooD4tBF4pPz9zQgLw?e=zXnhRs)

## Autores

- [Cesar Salazar](https://github.com/Cszart)
- [Valentina Contreras](https://github.com/ValentinaSW)

## Feedback

Si tienen algun _Feedback_ pueden contactarse con cesarasalazarh1@gmail.com

## License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

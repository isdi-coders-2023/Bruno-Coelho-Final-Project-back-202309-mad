# MVP Bruno Beauty Care - Plataforma de Cuidados Estéticos Femeninos

## Descripción del Proyecto

Bruno Beauty Care es un proyecto centrado en proporcionar servicios y cuidados estéticos femeninos. Desarrollado como parte de nuestro compromiso con la excelencia en el mundo de la belleza, la aplicación ofrece una plataforma integral para explorar, registrar y gestionar diversos servicios de cuidado estético.

## Funcionalidades Principales

### Registro y Login de Usuarios

La aplicación presenta un sistema de registro y login que permite a los usuarios gestionar sus cuentas de manera segura y personalizada.

### Lista de Cuidados Estéticos

Los usuarios pueden explorar la lista completa de cuidados estéticos disponibles en Bruno Beauty Care, proporcionando una visión detallada de cada servicio.

### Funcionalidades de Administrador

Los administradores disfrutan de privilegios exclusivos, incluyendo la capacidad de:

- Crear nuevos cuidados estéticos.
- Modificar información de cuidados existentes.
- Eliminar servicios de la plataforma.

### Detalles del Cuidado Estético

Ambos tipos de usuarios pueden acceder a detalles específicos de cada cuidado estético, incluyendo sus características y requisitos. Se ha implementado un filtro para facilitar la búsqueda según las preferencias de los usuarios.

## Tecnologías Utilizadas

**MERN Stack:**

- MongoDB con Mongoose (Backend)
- Express (Backend)
- React (Frontend)
- Node (Backend)

### Pruebas

Todas las funcionalidades han sido rigurosamente testeadas con Jest para garantizar un rendimiento óptimo.

## Listado de Endpoints

### Usuarios

| Método | URL             | Descripción                                                                    |
| ------ | --------------- | ------------------------------------------------------------------------------ |
| POST   | /users/register | Registrar un nuevo usuario con campos obligatorios.                            |
| POST   | /users/login    | Autenticar un usuario con nombre de usuario o correo electrónico y contraseña. |
| GET    | /users          | Obtener una lista de usuarios. (Solo puede realizarlo el administrador)        |

### Cuidados Estéticos

| Método | URL        | Descripción                                                                               |
| ------ | ---------- | ----------------------------------------------------------------------------------------- |
| GET    | /cares     | Obtener la lista de cuidados estéticos disponibles.                                       |
| GET    | /cares/:id | Obtener información detallada sobre un cuidado estético específico.                       |
| POST   | /cares     | Agregar un nuevo cuidado estético a la colección. Requiere derechos de administrador.     |
| PATCH  | /cares/:id | Actualizar detalles de un cuidado estético existente. Requiere derechos de administrador. |
| DELETE | /cares/:id | Eliminar un cuidado estético de la colección. Requiere derechos de administrador.         |

## Instrucciones de Ejecución

Antes de ejecutar el backend de la aplicación, asegúrese de tener instaladas las siguientes dependencias:

1. **Node.js:** Descargar e instalar Node.js.
2. **MongoDB:** Descargar e instalar MongoDB.

### Configuración del Backend

1. **Clone el repositorio:**

```bash
git clone https://github.com/isdi-coders-2023/Bruno-Coelho-Final-Project-back-202309-mad
```

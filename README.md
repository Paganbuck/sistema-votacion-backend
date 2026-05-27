

# 🗳️ Sistema de Votación Electrónico Corporativo

Plataforma web blindada para la gestión segura de elecciones y consultas corporativas en tiempo real. 
Diseñada bajo un modelo full-stack desacoplado para garantizar la transparencia, el anonimato y la automatización del escrutinio general.

---

## 🎯 Finalidad y Objetivos

* **Anonimato Absoluto:** Separa por completo la identidad del votante de su elección en la urna virtual, haciendo técnicamente imposible rastrear o correlacionar qué opción eligió un ciudadano específico.
* **Integridad de los Datos:** Bloquea alteraciones o fraudes en los registros mediante el uso de hashing criptográfico SHA-512 en el backend.
* **Aislamiento de Roles:** Implementa un tarjetón "ciego" para el ciudadano común y una consola restringida con asteriscos (`*****`) exclusiva para el Administrador.
* **Escrutinio Automático:** Provee un panel de auditoría que calcula totales, porcentajes y barras de progreso en tiempo real a medida que ingresan los sufragios.

---

## 🛡️ Pilares de Seguridad

1. **Integridad:** Persistencia protegida contra ataques de inyección de código (SQL Injection) y hashing de seguridad en la base de datos.
2. **Anonimato:** Flujo de control de accesos ciego. Una vez validado el ingreso, el documento se inhabilita para prevenir el doble voto, pero el sufragio ingresa a la urna de forma aislada.
3. **Disponibilidad:** Arquitectura desacoplada en capas que asegura un alto rendimiento durante jornadas electorales de alta concurrencia.

---

## 🔑 Flujo de Acceso: ¿Cómo ingresar como Administrador?

El sistema unifica el punto de entrada para mitigar vectores de ataque por exposición de rutas. El acceso se bifurca en el backend según el valor ingresado:

* **Acceso Votante:** Ingrese cualquier documento de identidad válido (mínimo 6 dígitos). El sistema validará en el censo (`votante_registrado`) si la identificación ya sufragó. Si está limpio, habilita el tarjetón.


* **Acceso Administrador (Auditoría y Gestión):** Para ingresar al panel de control y auditoría en tiempo real, el administrador debe iniciar sesión utilizando la identificación por defecto establecida en la base de datos: **`999999`**. El backend validará este código contra la tabla perimetral `administrador` y, tras conceder el acceso, desplegará de forma exclusiva la consola con dos funciones mayores:
  1. **Contador en Tiempo Real:** Gráficas, porcentajes y barras de escrutinio que se actualizan de manera automática con cada voto registrado en la urna digital.
  2. **Formulario de Candidatos:** Interfaz de entrada de datos para registrar nuevos candidatos en el sistema, asignándoles nombre, partido político y URL de recurso visual, los cuales se reflejan instantáneamente en el tarjetón público y la base de datos.

---

## 💻 Stack Tecnológico

* **Backend:** Java 17, Spring Boot, Maven, Spring Data JPA.
* **Frontend:** React (Vite), Tailwind CSS, Axios, JavaScript (ES6+).
* **Base de Datos:** MySQL.

---

## 🏗️ Estructura del Repositorio

```text
├── votacion-backend/        # API REST del servidor (Spring Boot)
├── votacion-web/            # Interfaz de usuario (React + Vite)
├── votacion_db.sql          # Script de estructura y datos de la BD (phpMyAdmin)
└── .gitignore               # Filtro global unificado (Limpio)

🚀 Despliegue Local Rápido
1. Configuración de la Base de Datos (MySQL / phpMyAdmin)
Abre phpMyAdmin y crea una base de datos llamada votacion_db.

Selecciona la base de datos, ve a la pestaña Importar.

Elige el archivo votacion_db.sql ubicado en la raíz de este repositorio y haz clic en Continuar e Importar. Esto creará las tablas y cargará los candidatos iniciales.

2. Levantar el Backend (Spring Boot)
Abre una terminal en la raíz de la carpeta votacion-backend y ejecuta:

Bash
./mvnw spring-boot:run
El servidor backend se activará en el puerto 8080.

3. Levantar el Frontend (React + Vite)
Abre una segunda terminal en la carpeta votacion-web, instala los paquetes y enciende el entorno de desarrollo:

Bash
npm install
npm run dev
La interfaz web se desplegará en el puerto 5173. Abre http://localhost:5173 en tu navegador.

Criptografía Homomórfica y Privacidad de Datos © 2026
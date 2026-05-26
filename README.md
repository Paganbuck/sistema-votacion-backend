# Sistema de Votación Electrónico Corporativo

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

## 💻 Stack Tecnológico

* **Backend:** Java 17, Spring Boot, Maven, Spring Data JPA.
* **Frontend:** React (Vite), Tailwind CSS, Axios, JavaScript (ES6+).
* **Base de Datos:** MySQL.

---

## 🏗️ Estructura del Repositorio

```text
├── votacion-backend/          # API REST del servidor (Spring Boot)
├── votacion-web/              # Interfaz de usuario (React + Vite)
└── .gitignore                 # Filtro global unificado (Limpio)

---

---

## 🚀 Acceso a la Exhibición en Línea

El sistema se encuentra totalmente desplegado y automatizado en la nube, por lo que **no requiere configuraciones locales, bases de datos manuales ni instalaciones** para su revisión.

* **Vista del Votante:** Ingrese cualquier documento de identidad válido (mínimo 6 dígitos). El sistema validará preventivamente si ya sufragó. El tarjetón es completamente ciego para garantizar la privacidad.
* **Vista de Administrador (Auditoría):** Ingrese el código maestro exclusivo en el campo de identificación para saltar directamente al Panel de Control con las barras de progreso y porcentajes en tiempo real. El campo enmascara la clave para evitar espionaje visual.

---
Criptografía Homomórfica y Privacidad de Datos © 2026

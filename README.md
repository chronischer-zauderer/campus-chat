# Campus Chat - Plataforma de Comunicación Académica

> **Proyecto Final - Diseño de Contenido para Interfaces de Usuario**  
> Universidad del Valle - Sede Tuluá (2025)

![Estado del Proyecto](https://img.shields.io/badge/Estado-Prototipo%20Funcional-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## 📋 Descripción del Proyecto

**Campus Chat** es una aplicación web diseñada para centralizar y mejorar la comunicación y gestión académica entre estudiantes y profesores. Este proyecto nace como respuesta a la necesidad de unificar herramientas dispersas (calendarios, chats, archivos) en una sola interfaz intuitiva y accesible.

Este repositorio contiene el **Prototipo Funcional de Alta Fidelidad** desarrollado como parte del proyecto final del curso.

## 🎯 Objetivos y Problemática

El aplicativo busca resolver las siguientes problemáticas identificadas en la fase de investigación:
1.  **Dispersión de la información:** Los estudiantes deben revisar múltiples plataformas para ver notas, mensajes y archivos.
2.  **Comunicación ineficiente:** Falta de canales directos y organizados para la comunicación académica.
3.  **Accesibilidad:** Muchas herramientas actuales no cuentan con opciones de accesibilidad integradas.

## ✨ Características Principales (Features)

*   **Dashboard Unificado:** Vista general de materias, tareas pendientes y notificaciones recientes.
*   **Sistema de Chat:** Mensajería en tiempo real para grupos de estudio y comunicación con profesores.
*   **Calendario Académico:** Gestión visual de entregas, parciales y eventos.
*   **Gestor de Archivos:** Repositorio centralizado para material de clase.
*   **Panel de Estadísticas:** Visualización del rendimiento académico (para profesores/estudiantes).
*   **Menú de Accesibilidad:** Herramientas integradas para ajustar tamaño de texto, contraste y animaciones (Cumplimiento WCAG).
*   **Modo Oscuro/Claro:** Soporte nativo para preferencias de tema del sistema.

## 🛠️ Tecnologías Utilizadas (Tech Stack)

Este proyecto utiliza un stack moderno enfocado en rendimiento y experiencia de usuario (UX):

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Basado en Radix UI)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Gestión de Estado & Formularios:** React Hook Form, Zod.
*   **Gráficos:** Recharts (para estadísticas).

### Justificación del UI Kit
Se seleccionó **shadcn/ui** junto con **Radix UI** debido a su enfoque en la **accesibilidad (a11y)** y la personalización. A diferencia de otras librerías, esta permite tener control total sobre el código de los componentes, facilitando la adaptación a la identidad visual del proyecto sin sacrificar usabilidad.

## 🚀 Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/campus-chat.git
    cd campus-chat
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o si usas pnpm (recomendado)
    pnpm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    pnpm dev
    ```

4.  **Abrir en el navegador:**
    Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📂 Estructura del Proyecto

La arquitectura de información se refleja en la estructura de carpetas:

```
/app
  ├── dashboard/      # Panel principal
  ├── calendar/       # Vista de calendario
  ├── chat/           # Módulo de mensajería
  ├── files/          # Gestión de documentos
  └── layout.tsx      # Estructura base (Sidebar, Nav)
/components
  ├── ui/             # Componentes atómicos (Botones, Inputs, Cards)
  └── ...             # Componentes complejos (ChatWindow, StatsPanel)
/lib
  └── demo-data.ts    # Datos simulados para el prototipo
```

## 👥 Equipo

*   **Curso:** Diseño de Contenido para Interfaces de Usuario
*   **Profesor:** Ing. Mateo Echeverry Correa
*   **Fecha de Entrega:** 05/12/2025

---
*Este proyecto es un prototipo académico y utiliza datos simulados para fines de demostración.*
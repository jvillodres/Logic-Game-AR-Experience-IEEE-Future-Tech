# 🚀 La Misión Espacial — AR Educational Game

Juego educativo de Realidad Aumentada que enseña **lógica computacional**
a niños a través de una aventura espacial.

---

## 📁 Estructura del proyecto

```
space-mission-ar/
│
├── index.html                      ← Entry point + router de niveles
│
├── src/
│   ├── systems/                    ← Lógica de juego sin DOM
│   │   ├── game-state.js           ← Estado global (inventario, nivel, progreso)
│   │   └── timer.js                ← Countdown timer reutilizable
│   │
│   ├── components/                 ← Componentes A-Frame personalizados
│   │   ├── battery-pickup.js       ← Componente: recoger la batería en AR
│   │   ├── and-gate-logic.js       ← Componente: evalúa la compuerta AND
│   │   ├── laser-controller.js     ← (por crear) Control del láser NOT
│   │   └── obstacle-spawner.js     ← (por crear) Generador de obstáculos
│   │
│   ├── levels/                     ← Una escena HTML por nivel
│   │   ├── level1-and.html         ← Encender motor          → Compuerta AND
│   │   ├── level2-or.html          ← Cruzar el espacio       → Compuerta OR
│   │   ├── level3-not.html         ← Láser de protección     → Compuerta NOT
│   │   └── level4-combined.html    ← Isla de los dragones    → (OR) AND NOT
│   │
│   └── ui/
│       ├── hud.css                 ← Todos los estilos del HUD overlay
│       ├── hud.js                  ← Controlador: top bar, timer, mensajes, win
│       ├── inventory.js            ← Controlador: barra de inventario
│       └── logic-helper.js         ← Controlador: diagrama de compuertas
│
└── assets/
    ├── models/                     ← Modelos 3D (.glb)
    │   ├── spaceship.glb
    │   ├── battery.glb
    │   ├── astronaut.glb
    │   └── pets/
    │       └── astro-dog.glb
    ├── textures/                   ← Materiales y mapas UV
    ├── audio/
    │   ├── sfx/                    ← Efectos: battery-pickup.mp3, launch.mp3 ...
    │   └── music/                  ← Música ambiental
    └── images/
        ├── ui/                     ← Iconos del HUD
        └── markers/                ← Marcadores AR
```

---

## 🛠 Cómo ejecutar (desarrollo)

```bash
# Opción A — servidor estático simple (sin bundler)
npx serve .
# o
python3 -m http.server 8080

# Opción B — con Vite (recomendado para producción)
npm create vite@latest
# Copia los archivos y usa: npm run dev
```

> ⚠️ Los niveles se cargan con `fetch()` desde `index.html`, así que
> **necesitas un servidor HTTP** (no funciona abriendo `index.html` directamente
> con `file://` en el navegador).

Navega entre niveles con el hash de la URL:
```
http://localhost:8080/#level1
http://localhost:8080/#level2
http://localhost:8080/#level3
http://localhost:8080/#level4
```

---


## 📡 Comunicación entre componentes A-Frame y HUD

Los sistemas se comunican mediante **eventos de escena A-Frame** y **GameState**:

```
A-Frame Component          GameState          HUD / UI
─────────────────          ─────────          ────────
battery-pickup.js  ──emit──▶ batteryCollected  ──▶ inventory.js actualiza slots
and-gate-logic.js  ──emit──▶ andGateUpdate     ──▶ logic-helper.js ilumina diagrama
and-gate-logic.js  ──emit──▶ andGateSatisfied  ──▶ hud.js muestra pantalla de victoria
```

Ejemplo — emitir desde un componente:
```javascript
this.el.sceneEl.emit('batteryCollected', { entity: this.el });
```

Ejemplo — escuchar en HUD:
```javascript
document.querySelector('a-scene')
  .addEventListener('andGateUpdate', ({ detail }) => {
    LogicHelper.update(detail.inputA, detail.inputB);
  });
```

---

## 🎮 Niveles y compuertas

| Nivel | Nombre                  | Compuerta     | Mecánica principal                              |
|-------|-------------------------|---------------|-------------------------------------------------|
| 1     | Encender el motor       | AND           | Recoger batería + presionar 2 botones           |
| 2     | Cruzar el espacio       | OR            | Elegir cualquiera de 2 rutas                    |
| 3     | Láser de protección     | NOT           | Mantener botón para invertir estado del láser   |
| 4     | Isla de los dragones    | (OR) AND NOT  | Esquivar obstáculos y evitar zonas peligrosas   |

---

## 📦 Dependencias

| Librería     | Versión | CDN / npm                          |
|--------------|---------|------------------------------------|
| A-Frame      | 1.5.0   | `aframe.io/releases/1.5.0/...`    |
| AR.js        | latest  | `raw.githack.com/AR-js-org/...`   |
| MindAR       | 1.2.5   | `cdn.jsdelivr.net/npm/mind-ar`    |
| Howler.js    | 2.2.4   | `npm install howler`               |
| GSAP         | 3.x     | `npm install gsap`                 |

No hay bundler requerido para desarrollo. Para producción se recomienda **Vite**.
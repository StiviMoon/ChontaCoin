# 🌴 ChontaCoin

**ChontaCoin** es un proyecto de impacto social, ambiental y económico basado en la tecnología blockchain (Ethereum). Su objetivo es incentivar a la ciudadanía caleña a participar activamente en jornadas de limpieza y cuidado del entorno urbano, a cambio de recompensas en forma de tokens llamados **ChontaTokens**.

## 🎯 Objetivo

Fomentar el compromiso ciudadano con el entorno mediante un sistema de incentivos digitales que recompensa acciones positivas como:
- Participación en jornadas de limpieza.
- Separación adecuada de residuos.
- Actividades comunitarias ecológicas.

## 🚀 ¿Cómo funciona?

1. **Registro con wallet:** Los usuarios deben conectarse con su wallet Ethereum para acceder a cualquier funcionalidad del sitio.
2. **Participación en actividades:** Los ciudadanos participan en eventos o retos ambientales.
3. **Recompensas:** Reciben **ChontaTokens**, que pueden canjear por:
   - Recargas para el transporte MIO.
   - Descuentos en comercios locales aliados.

## 🔐 Acceso Restringido

El sitio completo está restringido:  
🟢 Solo los usuarios con una wallet conectada pueden acceder a cualquier parte, incluida la **landing page**.

## 🖥️ Estructura del Sitio

El sitio está desarrollado con **Next.js** para el frontend y **Node.js** para el backend. La estructura de navegación incluye:

- **INICIO:** Presentación de la iniciativa.
- **¿QUÉ ES CHONTACOIN?** Explicación del token y su propósito.
- **¿CÓMO FUNCIONA?** Paso a paso del sistema de recompensas.
- **VENTAJAS Y USOS:** Beneficios del token para los ciudadanos.
- **RECOMPENSAS:** Listado de premios y canjes disponibles.
- **UNETE / WALLET LOGIN:** Acceso mediante conexión con MetaMask u otra wallet.

## 🧱 Tecnologías utilizadas

- ⚛️ **Next.js** (frontend)
- 🟩 **Node.js + Express** (backend)
- 🔐 **Web3.js / ethers.js** para interacción con la blockchain
- 💾 MongoDB (base de datos para usuarios y actividad)
- 🧠 IPFS / NFT.storage (opcional para almacenar evidencia de participación)

## 📦 Instalación

```bash
git clone git@github-personal:StiviMoon/ChontaCoin.git
cd ChontaCoin
npm install
npm run dev

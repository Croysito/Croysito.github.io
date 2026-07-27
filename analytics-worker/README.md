# Contador de vistas real (Cloudflare Web Analytics)

Reemplaza a GoatCounter, que estaba subcontando vistas (respeta `Do Not
Track` por defecto y `gc.zgo.at` cae en más listas de bloqueo de rastreadores
que el beacon de Cloudflare). Este Worker lee el número que ya ves en tu
dashboard de **Web Analytics** y lo expone en un endpoint público que el
sitio consulta con `fetch`, igual que hacía antes con GoatCounter.

`account_tag` y `site_tag` ya están precargados en `wrangler.toml` (los saqué
de la URL de tu dashboard que compartiste). Solo falta el API token.

## 1. Crear el API token

1. Andá a https://dash.cloudflare.com/profile/api-tokens
2. **Create Token → Custom token**
3. Permisos: `Account` → `Account Analytics` → **Read** (si tu cuenta muestra
   una categoría específica de "Web Analytics", usá esa; si no aparece,
   "Account Analytics: Read" es la que necesita el dataset RUM).
4. Account Resources: incluí la cuenta donde vive el sitio (la del tag
   `80144f9bccf5146d7951fdcd052cd065`).
5. Creá el token y copialo — Cloudflare solo lo muestra una vez.

## 2. Instalar wrangler (si no lo tenés)

```bash
npm install -g wrangler
```

## 3. Desde esta carpeta (`analytics-worker/`)

```bash
wrangler login
wrangler secret put CF_API_TOKEN
# pegá el token del paso 1 cuando lo pida

wrangler deploy
```

Al terminar, `wrangler deploy` imprime la URL pública del Worker, algo como:

```
https://paginaguias-vistas.<tu-subdominio>.workers.dev
```

## 4. Conectar el sitio al Worker

En todos los HTML del sitio (`index.html` y cada guía) hay un placeholder:

```
WORKER_URL_AQUI
```

Reemplazalo por la URL real del paso 3, en todos los archivos a la vez, desde
la raíz del repo:

**PowerShell:**
```powershell
Get-ChildItem -Recurse -Include *.html | ForEach-Object {
  (Get-Content $_.FullName -Raw) -replace 'WORKER_URL_AQUI', 'https://paginaguias-vistas.tu-subdominio.workers.dev' |
    Set-Content $_.FullName -Encoding utf8 -NoNewline
}
```

**Bash:**
```bash
grep -rl 'WORKER_URL_AQUI' --include='*.html' . | xargs sed -i 's#WORKER_URL_AQUI#https://paginaguias-vistas.tu-subdominio.workers.dev#g'
```

## Notas / trade-offs

- **La ventana es de 30 días, no "desde siempre"**: Cloudflare Web Analytics
  (RUM) no retiene datos de forma indefinida como hacía GoatCounter
  (`?start=2020-01-01`). El Worker suma visitas de los últimos 30 días
  (`WINDOW_DAYS` en `worker.js`). El label del contador en el sitio ahora
  dice "vistas (30d)" para que quede claro que no es un total histórico.
- El Worker cachea cada respuesta 1 hora (`Cache-Control` + Cache API) para
  no gastar cuota de la API de Cloudflare ni pegarle a GraphQL en cada visita.
- El plan gratuito de Workers (100k requests/día) sobra para este tráfico.
- GoatCounter y el beacon de Cloudflare (`beacon.min.js`) siguen ambos en el
  HTML: el beacon sigue siendo necesario porque es lo que alimenta los datos
  que este Worker lee. Si querés, se puede sacar GoatCounter del todo ya que
  dejó de usarse para el contador visible (ver más abajo).

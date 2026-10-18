# Constellation Orion reference and license

This independent package is licensed AGPL-3.0-only (see LICENSE). Its transport
construction, CacheStorage-first selection and single self-describing OPFS file
format are adaptations of the local shoestring reference, itself derived from
Night Network / DDX. Read references:

- `../../shoestring/src/sw/{transport,mirror-store,opfs-store}.ts`
- `../../shoestring/src/vendor/transport.ts`
- `../../shoestring-nebula/src/` (layout/reference only)
- Space's actual `srv/vite/manifest.ts` and `src/runtime/config.ts` contracts

No sibling imports are required at build/deployment time. No Daydream path/theme
shim, WebSocket monkeypatch or capability-advertisement code was copied.
Third-party `@mercuryworkshop` packages retain their own upstream licenses.

Reference SHA-256 (2026-09-30):

| Reference | SHA-256 |
| --- | --- |
| shoestring `sw/transport.ts` | `efea61feacc7554a6c8a938ba85568f230fbbe3fb167b86fe5f8511b3c4debdb` |
| shoestring `vendor/transport.ts` | `d67b30a41741a2d75f27a723621594851ba543e4598b01f992de6c62e3a381cc` |
| shoestring / shoestring-nebula `sw/opfs-store.ts` | `70de1887adbac051cdfaad424a255c8e5d18b7f69dbfc33511d1c24727d4da2a` |
| shoestring `sw/mirror-store.ts` | `e21f3bf39dba3e75f83031d3b1085050f6a5ceba287b9aa530c4588b0ca3da64` |
| AGPL LICENSE | `c88d8799faeb22a258c24fe6c2be23b653f378c8ad3f07b6a4e51512386bb27c` |

## Local use

Use npm. Copy `.env.example` to `.env` and select an explicit source origin,
exact source build ID and, optionally, external bootstrap Wisp endpoint. Run
`npm ci`, `npm test`, `npm run typecheck`, `npm run build`, `npm run serve`.
For a local Space source: `node serve.mjs ../../Space-v2/dist 8091`.
Direct cross-origin HTTP requires CORS; no automatic network fallback occurs.
The endpoint fetches the build and explicitly configures Space's own transport
after a correlated worker handshake. It never rewrites game WebSocket URLs.

All manifest files are streamed under byte/count/deadline limits; exact status,
MIME, size and SHA-256 are required. After persisted-byte checks, re-fetch the
manifest and require identical bytes before committing its one-record marker.
Use a unique build ID per immutable release. The trusted manifest is integrity,
not publisher authentication: HTTPS/source trust remains the operator's duty.

The public storage keys are
`assetKey(config,path,sha256,await manifestVersion(manifest))` and
`completionKey(config)`. Namespace segments are UTF-8 hex for origin/build;
asset keys include both body hash and a SHA-256 of the JSON-serialized manifest
(including MIME/metadata), so failed same-ID attempts cannot overwrite the
previous committed release's responses. Already verified responses under the
same manifest version are retained unchanged, including statusText and all
headers; changing HTTP metadata requires a new manifest/build version. Every
retry still fetches/hash-checks all source assets. Completion is the exact JSON manifest, written
as one CacheStorage entry or one OPFS close-committed record. Both stores check
all persisted hashes again at completion, including after fallback migration.
OPFS records preserve status/statusText/headers and raw response bytes. A stale
or corrupt record is a miss, not a successful mirror. Partial assets are retained
for retry; garbage collection is not implemented in Task 8.

## Single controlling worker

The verified installer records its selected backend in IndexedDB, registers
only `/bootstrap-sw.js` at root with revalidation, waits for a correlated
build-specific ownership reply, then launches the mirrored entry. Worker restart
reopens that backend and verifies every committed asset before composing Space's
classic worker. CacheStorage recovering does not override an OPFS selection.

Classic composition uses one shared declaration environment across every imported
script. Acorn lowers global declarations only: lexical const/let/class use binding
records with TDZ/const/redeclaration checks, while var/functions use the global
object. Local scopes, closures, expressions, patterns and strictness execute as
JavaScript; identifiers are not blanket-rewritten into globals. All import
arguments/nested dependencies load, and strings/comments/regexes stay inert.
Native data-URL imports were rejected because browsers disallow them after worker
installation, including restart. Imported publisher code remains trusted executable
code, not sandboxed data; worker CSP must permit evaluation. Acorn's MIT license is
shipped as `ACORN-LICENSE`, copyright 2012–2022 contributors,
https://github.com/acornjs/acorn. Captured worker message ports
and lifecycle events remain original events, and only one fetch response is
claimed. Shoestring does not implement or advertise proxy-context delegation.

The local server and mirrored responses send COOP/COEP; a separate hosting server
must also send `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` for the initial installer so libcurl
can initialize. Do not cache the root worker immutably. A failed mirror retains a
retryable installer error; incomplete bytes are never launched.
## Delegated entry handoff

The entry negotiates the canonical `proxy-context-v1` client before creating a
store or transport. A real delegated session is checked and navigates to the
configured source's `index.svg?view=games` (or `index.html` with `?entry=html` on
the bootstrap URL). No local bootstrap worker or mirror is started in this path;
the owning host rewrites the original source/game URLs. Handoff failure is
visible and cannot fall through to local registration. Delegated handoff still
requires a reachable source; offline mirror recovery is the standalone path.

Building this entry uses `../../Space-v2/src/bridge/{client,protocol}.ts` as the
canonical protocol source, bundled into the entry artifact. Deployment does not
fetch sibling source. Keep that source tree available when building this
workspace; Space's own production build remains self-contained.

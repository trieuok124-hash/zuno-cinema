# ZUNO Cinema

Static Cloudflare Pages frontend connected to the existing Supabase database.

## Deploy
Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → select this repository.
- Production branch: main
- Framework preset: None
- Build command: exit 0
- Build output directory: .

Public Supabase publishable key is in config.js; never add a service_role key to client code.

## Current scope
Movie catalog, episode list, multi-server player, HLS (hls.js), responsive layout. Existing administration remains on the original Floot app until a secure admin is migrated. Video hosts may block cross-origin playback; only use sources you are authorized to embed.

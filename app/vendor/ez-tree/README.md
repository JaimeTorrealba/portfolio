# ez-tree (vendored)

Copied from `@dgreenheck/ez-tree` 1.1.0, `src/lib/` (MIT, see `LICENSE`).
Upstream: https://github.com/dgreenheck/ez-tree

The npm build inlines all 20 textures as base64 (about 4 MB of the JS bundle) and
loads every one of them on import. This copy is built by our own Vite, so the
textures ship as separate, hashed, cacheable files, and it is ours, so an upgrade
can't quietly undo the changes below.

The files are kept as upstream wrote them so they stay comparable with the original,
apart from these local changes (each marked `LOCAL CHANGE` in the code):

- `textures.js`: a texture loads the first time a tree asks for it, not on import.
- `tree.js`: leaves of size 0 don't fetch a leaf texture.

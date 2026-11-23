# blender-headless skill

Run Blender without GUI. Designed for Claude automation: deterministic headless renders, GLB export, batch processing.

## Usage

```bash
blender --background --factory-startup --python render_headless.py -- input.obj output.png
blender --background scene.blend --frame-start 1 --frame-end 1 --render-output //render_ --render-anim
```

## Files

- `render_headless.py` — generic import + render pipeline
- `run_blender_headless.sh` — bash wrapper
- `export_glb.py` — export to GLB for web

## Best practices

- Always `--factory-startup`
- Write logs to stdout
- One Blender process per file

import bpy, sys
from pathlib import Path

in_path = sys.argv[-2]
out_path = sys.argv[-1]

bpy.ops.wm.read_factory_settings(use_empty=True)

if in_path.lower().endswith('.blend'):
    bpy.ops.wm.open_mainfile(filepath=in_path)
else:
    bpy.ops.import_scene.obj(filepath=in_path)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

cam = bpy.data.objects.get('Camera') or bpy.data.cameras.new('Cam')
scene.camera = cam

Path(out_path).parent.mkdir(parents=True, exist_ok=True)
scene.render.filepath = out_path
bpy.ops.render.render(write_still=True)
print(f"Rendered -> {out_path}")

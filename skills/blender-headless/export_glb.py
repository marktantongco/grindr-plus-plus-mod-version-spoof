import bpy, sys
in_path = sys.argv[-2]
out_path = sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.open_mainfile(filepath=in_path) if in_path.lower().endswith('.blend') else bpy.ops.import_scene.obj(filepath=in_path)
bpy.ops.export_scene.gltf(filepath=out_path, export_format='GLTF_SEPARATE')
print(f"Exported GLB -> {out_path}")

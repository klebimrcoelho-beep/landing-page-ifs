"""
Script de setup do projeto IFS Landing Page
Execute este arquivo uma única vez para copiar os assets de imagem.
Uso: python setup_assets.py
"""
import os
import shutil
import sys

# ============================================================
# INSTRUÇÕES: 
# Este script copia as imagens geradas para o diretório do projeto.
# Execute: python setup_assets.py
# ============================================================

project_dir = os.path.dirname(os.path.abspath(__file__))

print("=" * 60)
print("  Instituto Freudiano de Salvador — Setup de Assets")
print("=" * 60)

# Verifica se as imagens já existem no projeto
logo_path = os.path.join(project_dir, 'ifs_logo.png')
hero_path = os.path.join(project_dir, 'hero_bg.png')

if os.path.exists(logo_path) and os.path.exists(hero_path):
    print("\n✓ Assets já existem no diretório do projeto!")
    print(f"  → {logo_path}")
    print(f"  → {hero_path}")
    sys.exit(0)

# Tenta localizar os arquivos gerados pela IA
brain_dir = os.path.join(
    os.path.expanduser('~'),
    '.gemini', 'antigravity-ide', 'brain',
    '0b9ee720-9c02-49fe-b0e8-ad5377f0eef1'
)

image_map = {
    'ifs_logo_project_1788390780474.png': 'ifs_logo.png',
    'ifs_logo_1788388612051.png':         'ifs_logo.png',
    'hero_bg_project_1788390791488.png':  'hero_bg.png',
    'hero_background_1788388622523.png':  'hero_bg.png',
}

for src_name, dst_name in image_map.items():
    dst = os.path.join(project_dir, dst_name)
    if os.path.exists(dst):
        continue
    src = os.path.join(brain_dir, src_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"✓ Copiado: {src_name} → {dst_name}")
        break
else:
    if not os.path.exists(logo_path):
        print("⚠ Não foi possível localizar o arquivo de logo.")
        print("  Coloque manualmente uma imagem chamada 'ifs_logo.png' na pasta do projeto.")

for src_name, dst_name in list(image_map.items())[2:]:
    dst = os.path.join(project_dir, dst_name)
    if os.path.exists(dst):
        continue
    src = os.path.join(brain_dir, src_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"✓ Copiado: {src_name} → {dst_name}")
        break
else:
    if not os.path.exists(hero_path):
        print("⚠ Não foi possível localizar o arquivo de hero background.")
        print("  Coloque manualmente uma imagem chamada 'hero_bg.png' na pasta do projeto.")

print("\n✓ Setup concluído!")
print("  Abra o index.html no navegador para visualizar a landing page.")

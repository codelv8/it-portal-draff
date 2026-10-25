"""Optional dev check. Requires Pillow; never modifies image bytes."""
from pathlib import Path
from PIL import Image
import hashlib
import json

root = Path(__file__).resolve().parent.parent
contract = json.loads((root / 'design-contract.json').read_text(encoding='utf-8'))
results = []
for variant, options in contract['mascotVariants'].items():
    for reaction in contract['mascotReactions']:
        asset = root / 'assets/images/mascot' / options['directory'] / (reaction + '.png')
        with Image.open(asset) as image:
            assert image.format == 'PNG' and image.mode == 'RGBA', str(asset)
            if options['square']:
                assert image.width == image.height, f'Non-square: {asset}'
            alpha = image.getchannel('A')
            minimum, maximum = alpha.getextrema()
            assert minimum == 0 and maximum >= 200, f'No usable alpha: {asset}'
            transparent = sum(1 for value in alpha.getdata() if value == 0)
            assert transparent / (image.width * image.height) >= 0.05, f'Insufficient empty background: {asset}'
            corners = [(0, 0), (image.width-1, 0), (0, image.height-1), (image.width-1, image.height-1)]
            corner_alpha = [alpha.getpixel(point) for point in corners]
            # Preserve the original full-body typing PNG's existing 1/255 alpha noise.
            # Newly generated half-body corners must be exactly transparent.
            tolerance = 0 if variant == 'half-body' else 1
            assert all(value <= tolerance for value in corner_alpha), f'Opaque corner: {asset}'
            results.append({'variant':variant,'reaction':reaction,'size':image.size,'alpha':[minimum,maximum],'cornerAlpha':corner_alpha,'sha256':hashlib.sha256(asset.read_bytes()).hexdigest()})

assert len(results) == 20
output = root / 'test-results/half-body'
output.mkdir(parents=True, exist_ok=True)
(output / 'assets.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
baseline = output / 'full-body-hashes-before.json'
if baseline.is_file():
    expected = json.loads(baseline.read_text(encoding='utf-8-sig'))
    for item in expected:
        asset = Path(item['Path'])
        assert hashlib.sha256(asset.read_bytes()).hexdigest().upper() == item['Hash'], f'Changed original: {asset.name}'
    print('Original full-body PNGs: 10/10 byte-identical')
print(f'MASCOT ASSETS PASSED: {len(results)}/20 RGBA PNGs; 10 square half-body reactions')

from pathlib import Path
from PIL import Image, ImageDraw
from random import Random

assets = Path(__file__).resolve().parents[2] / "pack/overrides/kubejs/assets/kubejs/textures"
gui = assets / "gui"
gui.mkdir(exist_ok=True)
wood = {
    "#": "#38241b", "e": "#563521", "m": "#895332", "w": "#ab7143",
    "h": "#cb9158", "l": "#e2b77a", "b": "#654128",
}

sprites = {
    "haft_blank": [
        "................", "............##..", "..........##we#.", ".........#lmme#.",
        "........#lwwm#..", ".......#hwwb#...", "......#lmwb#....", ".....#lwmme#....",
        "....#hwme##.....", "...#lwmme#......", "..#lwwbe#.......", ".#hwmmbe#.......",
        ".#wmmbe#........", ".#meb##.........", "..###...........", "................",
    ],
    "tool_handle": [
        "................", "...........###..", "..........#lhm#.", ".........#lwm#..",
        "........#lwm#...", ".......#lwm#....", "......#lwm#.....", ".....#lwm#......",
        "....#lwm#.......", "...#hwm#........", "..#hwmb#........", ".#hwmb#.........",
        ".#wmb#..........", ".#me#...........", "..##............", "................",
    ],
}

for name, rows in sprites.items():
    icon = Image.new("RGBA", (16, 16))
    for y, row in enumerate(rows):
        assert len(row) == 16, (name, y)
        for x, pixel in enumerate(row):
            if pixel in wood:
                ImageDraw.Draw(icon).point((x, y), fill=wood[pixel])
    icon.save(assets / "item" / (name + ".png"))

rng = Random(15)
panel = Image.new("RGB", (176, 166), "#3e2821")
d = ImageDraw.Draw(panel)
for y in range(1, 165):
    for x in range(1, 175):
        mortar = y % 9 == 0 or (x + (y // 9 % 2) * 13) % 26 == 0
        v = rng.choice((-3, -1, 0, 1, 2, 4))
        base = (73, 48, 38) if mortar else (105, 67, 51)
        d.point((x, y), fill=tuple(c + v for c in base))
d.rectangle((1, 1, 174, 164), outline="#a16e50")
d.rectangle((3, 3, 172, 162), outline="#4a2c23")
d.rectangle((6, 25, 169, 62), fill="#261a16", outline="#9f6849")
d.rectangle((8, 27, 167, 60), outline="#4e3329")
d.rectangle((5, 81, 170, 160), fill="#34231d", outline="#ac7653")
d.line((7, 71, 168, 71), fill="#34221b")
d.line((7, 72, 168, 72), fill="#aa7152")
for x in (5, 170):
    for y in (5, 158):
        d.rectangle((x, y, x + 2, y + 2), fill="#ad8762", outline="#51362b")
panel.save(gui / "field_bloomery.png")

slot = Image.new("RGB", (18, 18), "#201611")
d = ImageDraw.Draw(slot)
d.rectangle((0, 0, 17, 17), outline="#58392c", fill="#2b1e19")
d.line((0, 17, 17, 17, 17, 0), fill="#a27256")
d.rectangle((1, 1, 16, 16), outline="#231915")
slot.save(gui / "field_bloomery_slot.png")

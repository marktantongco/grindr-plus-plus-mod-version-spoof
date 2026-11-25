from PIL import Image

def feat(p):
    im = Image.open(p).convert('RGB'); px = im.load()
    W, H = im.size
    def band(y0, y1):
        best = 0
        for y in range(y0, min(y1, H), 2):
            xs = [x for x in range(40, min(1180, W), 2) if px[x, y][0] > 135]
            if xs:
                w = max(xs) - min(xs)
                if w > best:
                    best = w
        return best
    txt = 0
    for y in range(1900, min(2160, H), 2):
        n = sum(1 for x in range(40, min(700, W), 2) if px[x, y][0] > 170)
        txt += n
    low = band(2520, 2560)      # chat composer pill
    high = band(2380, 2460)     # profile reply bar / grid nav row
    mag = 0
    for y in range(300, min(2000, H), 20):
        n = sum(1 for x in range(40, min(1180, W), 10) if sum(px[x, y]) / 3 > 90)
        if n > mag:
            mag = n
    fill = sum(1 for y in range(2460, min(2632, H), 4) for x in range(40, min(1180, W), 8)
               if abs(px[x, y][0] - 31) <= 8 and abs(px[x, y][1] - 31) <= 8 and abs(px[x, y][2] - 32) <= 8)
    return low, high, mag, fill, txt

def classify(p):
    low, high, mag, fill, txt = feat(p)
    if low >= 1000 and high < 900:
        return 'chat'
    if low >= 1000 and high >= 1000:
        return 'chat'
    if mag > 90 and low < 900 and high < 900:
        return 'media'
    if high >= 900:
        return 'profile'
    if fill <= 60:
        return 'grid'
    return 'other'


if __name__ == '__main__':
    import sys
    low, high, mag, fill, txt = feat(sys.argv[1])
    print(low, high, mag, fill, classify(sys.argv[1]))

Add-Type -AssemblyName System.Drawing

$src = "C:\Users\munaf\.gemini\antigravity\brain\c76605a5-edbd-415f-ad01-c0f191e1ecc1\.user_uploaded\media_1787249471268.png"
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Host "Original Image Size: $($img.Width)x$($img.Height)"

# Find top-most non-black pixel (PhonePe logo)
$minY = $img.Height
$maxY = 0
$minX = $img.Width
$maxX = 0

# We only scan up to 65% of the height (to ignore copyright at the bottom)
$scanHeight = [int]($img.Height * 0.65)

for ($y = 0; $y -lt $scanHeight; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $pixel = $img.GetPixel($x, $y)
        # Check if not pure black (brightness > 20)
        if ($pixel.R -gt 25 -or $pixel.G -gt 25 -or $pixel.B -gt 25) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
}

# Add 24px padding around the content
$padding = 24
$finalX = [Math]::Max(0, $minX - $padding)
$finalY = [Math]::Max(0, $minY - $padding)
$finalWidth = [Math]::Min($img.Width - $finalX, ($maxX - $minX) + ($padding * 2))
$finalHeight = [Math]::Min($img.Height - $finalY, ($maxY - $minY) + ($padding * 2))

Write-Host "Bounding Box: X=$finalX, Y=$finalY, Width=$finalWidth, Height=$finalHeight"

$rect = New-Object System.Drawing.Rectangle($finalX, $finalY, $finalWidth, $finalHeight)
$cropped = $img.Clone($rect, $img.PixelFormat)

$dest = "f:\Downloads\Telegram Desktop\mahiskills\public\images\payment-qr.png"
$cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$cropped.Dispose()

Write-Host "Clean tightly-cropped PhonePe QR scanner saved to $dest"

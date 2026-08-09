$baseDir = "E:\All DELTA SYNTH Official Website"
$fullPath = Join-Path $baseDir "assets\images\voicebanks\full"
$profilePath = Join-Path $baseDir "assets\images\voicebanks\profile"
$contentPath = Join-Path $baseDir "assets\data\content.json"

$fullCount = 0
$profileCount = 0
$jsonValid = $false
$jsonNonEmpty = $false

if (Test-Path $fullPath) {
    $fullCount = (Get-ChildItem -Path $fullPath -File).Count
}

if (Test-Path $profilePath) {
    $profileCount = (Get-ChildItem -Path $profilePath -File).Count
}

if (Test-Path $contentPath) {
    try {
        $content = Get-Content $contentPath -Raw
        $json = $content | ConvertFrom-Json -ErrorAction Stop
        $jsonValid = $true
        
        # Check non-empty
        if ($json.PSObject.Properties.Count -gt 0) {
            $jsonNonEmpty = $true
        }
    } catch {
        Write-Host "JSON parsing error: $_"
    }
}

$results = [PSCustomObject]@{
    FullBodyCount = $fullCount
    ProfileCount = $profileCount
    ContentJsonValid = $jsonValid
    ContentJsonNonEmpty = $jsonNonEmpty
}

$results | Format-List

if ($fullCount -eq 55 -and $profileCount -eq 55 -and $jsonValid -and $jsonNonEmpty) {
    Write-Host "ALL PASSED" -ForegroundColor Green
} else {
    Write-Host "FAILED" -ForegroundColor Red
}

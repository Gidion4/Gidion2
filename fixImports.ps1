Write-Host "=== GIDION IMPORT FIXER v3 ===" -ForegroundColor Cyan

$root = "C:\Gidion\src"
$files = Get-ChildItem -Path $root -Recurse -Include *.ts

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $original = $content

    $fixed = $content -replace 'from "(.*)\.js"', 'from "$1.ts"' `
                      -replace "from '(.*)\.js'", "from '$1.ts'"

    if ($fixed -ne $original) {
        Copy-Item $file.FullName ($file.FullName + ".bak") -Force
        Set-Content $file.FullName $fixed
        Write-Host ("Fixed imports in: " + $file.FullName) -ForegroundColor Yellow
    }
}

Write-Host "All imports fixed inside src/. Backup files created." -ForegroundColor Green

$settingsPath = "$env:USERPROFILE\.claude\settings.json"
$content = Get-Content $settingsPath -Raw
$content = $content -replace 'https://token-plan-cn\.xiaomimimo\.com/anthropic', 'https://api.xiaomimimo.com/anthropic'
[System.IO.File]::WriteAllText($settingsPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done! Updated ANTHROPIC_BASE_URL"
Get-Content $settingsPath

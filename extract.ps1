$out = "dark-mode-context.md"
"=== E-XANH LIGHT MODE TOKEN EXPORT ===" | Out-File $out -Encoding utf8
"## Cau truc thu muc src/" | Add-Content $out
Get-ChildItem -Path src -Recurse -Include "*.css","*.scss" | Select-Object -ExpandProperty FullName | Add-Content $out
"" | Add-Content $out
"## CSS Variables (light mode)" | Add-Content $out
Get-ChildItem -Path src -Recurse -Include "*.css","*.scss" | Select-String "^\s*--" | Select-Object -ExpandProperty Line | Sort-Object -Unique | Add-Content $out
"" | Add-Content $out
"## Mau hardcode trong CSS" | Add-Content $out
Get-ChildItem -Path src -Recurse -Include "*.css","*.scss" | Select-String "color:\s*#|background:\s*#" | Select-Object -ExpandProperty Line | Sort-Object -Unique | Select-Object -First 50 | Add-Content $out
"" | Add-Content $out
"## Tailwind config" | Add-Content $out
if (Test-Path "tailwind.config.js") { Get-Content "tailwind.config.js" | Add-Content $out } elseif (Test-Path "tailwind.config.ts") { Get-Content "tailwind.config.ts" | Add-Content $out } else { "Khong dung Tailwind" | Add-Content $out }
Write-Host "Xong! File dark-mode-context.md da duoc tao."

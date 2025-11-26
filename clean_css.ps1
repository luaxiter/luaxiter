# Script para limpar o CSS
$inputFile = "c:\Users\ianpi\Downloads\Downloads\teste lua\styles_backup.css"
$outputFile = "c:\Users\ianpi\Downloads\Downloads\teste lua\styles.css"

# Ler o arquivo
$content = Get-Content $inputFile -Raw

# Remover a linha 340 com o } solto após /* Section Titles */
$content = $content -replace '(?m)^/\* Section Titles \*/\r?\n\}\r?\n', "/* Section Titles */`r`n"

# Remover linhas órfãs (647-650)
$content = $content -replace '(?m)^font-size: 1\.1rem;\r?\nfont-weight: 600;\r?\nanimation: pulse-hint 2s ease-in-out infinite;\r?\n\}\r?\n', ''

# Remover duplicações massivas (linhas 716-820 aproximadamente - segunda ocorrência de testimonial-card até gallery preview)
$lines = $content -split "`r`n"
$cleanLines = @()
$skipUntil = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -lt $skipUntil) { continue }
    
    # Se encontrar a segunda ocorrência de .testimonial-card (linha ~716)
    if ($i -gt 600 -and $lines[$i] -match '^\s*\.testimonial-card\s*\{' -and $cleanLines -match '\.testimonial-card') {
        # Pular até encontrar /* Image Viewer Modal */
        for ($j = $i; $j -lt $lines.Count; $j++) {
            if ($lines[$j] -match '/\* Image Viewer Modal \*/') {
                $skipUntil = $j
                break
            }
        }
        continue
    }
    
    $cleanLines += $lines[$i]
}

# Salvar arquivo limpo
$cleanLines -join "`r`n" | Out-File -FilePath $outputFile -Encoding UTF8 -NoNewline

Write-Output "CSS limpo criado com sucesso!"
Write-Output "Linhas originais: $($lines.Count)"
Write-Output "Linhas limpas: $($cleanLines.Count)"

# Minimal DOCX (Word) - CV sablonu demo
$outDir = Join-Path $PSScriptRoot "..\public"
$tempDir = Join-Path $env:TEMP "cv_docx_$(Get-Random)"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempDir "_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempDir "docProps") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempDir "word") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempDir "word\_rels") | Out-Null

$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
'@

$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
'@

$core = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"/>
'@

$app = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"/>
'@

$document = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>CV Şablonu – YasalHaklariniz Gönüllü Başvurusu</w:t></w:r></w:p>
    <w:p><w:r><w:t>Ad Soyad:</w:t></w:r></w:p>
    <w:p><w:r><w:t>E-posta:</w:t></w:r></w:p>
    <w:p><w:r><w:t>Kısa tanıtım / deneyim:</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>
'@

$documentRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>
'@

[System.IO.File]::WriteAllText((Join-Path $tempDir "[Content_Types].xml"), $contentTypes)
[System.IO.File]::WriteAllText((Join-Path $tempDir "_rels\.rels"), $rels)
[System.IO.File]::WriteAllText((Join-Path $tempDir "docProps\core.xml"), $core)
[System.IO.File]::WriteAllText((Join-Path $tempDir "docProps\app.xml"), $app)
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\document.xml"), $document)
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\_rels\document.xml.rels"), $documentRels)

$zipPath = Join-Path $outDir "cv-sablonu.zip"
$docxPath = Join-Path $outDir "cv-sablonu.docx"
if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force
Rename-Item -Path $zipPath -NewName "cv-sablonu.docx"
Remove-Item -Recurse -Force $tempDir
Write-Host "Created: $docxPath"

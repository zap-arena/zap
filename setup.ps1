<#
.SYNOPSIS
    One-command local setup for CodeArena / ZAP.

.DESCRIPTION
    Installs frontend and backend dependencies, creates .env, provisions a local
    PostgreSQL instance (no admin rights or Docker required), creates the schema
    and loads seed data (users, problems, contests, submissions).

    Safe to re-run: every step is skipped or updated in place if it already exists.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\setup.ps1

.EXAMPLE
    # Use an existing database instead of the bundled local one
    powershell -ExecutionPolicy Bypass -File .\setup.ps1 -DatabaseUrl "postgresql://user:pass@host/db"
#>
[CmdletBinding()]
param(
    # Connection string to use. Omit to provision a local PostgreSQL instance.
    [string]$DatabaseUrl,

    # Port for the bundled local PostgreSQL instance.
    [int]$DbPort = 5432,

    # Skip the seed-data step.
    [switch]$SkipSeed,

    # Drop and recreate the seeded rows.
    [switch]$ResetSeed
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$Root       = $PSScriptRoot
$ApiDir     = Join-Path $Root 'api'
$VenvPython = Join-Path $ApiDir '.venv\Scripts\python.exe'
$PgRoot     = Join-Path $Root '.postgres'
$PgData     = Join-Path $PgRoot 'data'
$EnvFile    = Join-Path $Root '.env'
$DbName     = 'codearena'

function Write-Step($n, $text) { Write-Host "`n[$n] $text" -ForegroundColor Cyan }
function Write-Ok($text)       { Write-Host "    $text" -ForegroundColor Green }
function Write-Skip($text)     { Write-Host "    $text" -ForegroundColor DarkGray }
function Write-Warn($text)     { Write-Host "    $text" -ForegroundColor Yellow }

function Get-PgBin {
    $dir = Get-ChildItem $PgRoot -Directory -Filter 'postgresql-*' -ErrorAction SilentlyContinue |
           Select-Object -First 1
    if ($dir) { return (Join-Path $dir.FullName 'bin') }
    return $null
}

# ---------------------------------------------------------------- 1. tooling
Write-Step 1 'Checking required tooling'
foreach ($cmd in 'node', 'npm', 'python') {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if (-not $found) { throw "'$cmd' was not found on PATH. See SETUP.md for prerequisites." }
    Write-Ok "$cmd -> $($found.Source)"
}

# ------------------------------------------------------- 2. frontend deps
Write-Step 2 'Installing frontend dependencies'
if (Test-Path (Join-Path $Root 'node_modules')) {
    Write-Skip 'node_modules already present - running npm install to sync'
}
npm install --no-fund --no-audit | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }
Write-Ok 'npm dependencies installed'

# -------------------------------------------------------- 3. backend venv
Write-Step 3 'Creating the backend virtual environment'
if (Test-Path $VenvPython) {
    Write-Skip 'api\.venv already exists'
} else {
    python -m venv (Join-Path $ApiDir '.venv')
    if (-not (Test-Path $VenvPython)) { throw 'Failed to create api\.venv.' }
    Write-Ok 'api\.venv created'
}

& $VenvPython -m pip install --quiet --upgrade pip
& $VenvPython -m pip install --quiet -r (Join-Path $ApiDir 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'pip install failed. If you are behind a corporate proxy, see SETUP.md.' }
Write-Ok 'Python dependencies installed'

# ------------------------------------------------------------- 4. .env file
Write-Step 4 'Preparing .env'
if (-not (Test-Path $EnvFile)) {
    Copy-Item (Join-Path $Root '.env.example') $EnvFile
    Write-Ok '.env created from .env.example'
} else {
    Write-Skip '.env already exists - only filling in blank values'
}

function Set-EnvValue($key, $value, [switch]$OnlyIfEmpty) {
    $lines = Get-Content $EnvFile
    $existing = $lines | Where-Object { $_ -match "^\s*$key\s*=" }
    if ($existing -and $OnlyIfEmpty) {
        $current = ($existing -split '=', 2)[1]
        if ($current -and $current.Trim()) { return $false }
    }
    if ($existing) {
        $lines = $lines | ForEach-Object { if ($_ -match "^\s*$key\s*=") { "$key=$value" } else { $_ } }
    } else {
        $lines += "$key=$value"
    }
    Set-Content $EnvFile -Value $lines -Encoding ascii
    return $true
}

if (Set-EnvValue 'JWT_SECRET' (& $VenvPython -c "import secrets; print(secrets.token_urlsafe(48))") -OnlyIfEmpty) {
    Write-Ok 'Generated a random JWT_SECRET'
}
Set-EnvValue 'ADMIN_EMAIL'    'admin@local.dev'          -OnlyIfEmpty | Out-Null
Set-EnvValue 'ADMIN_PASSWORD' 'Admin@12345'              -OnlyIfEmpty | Out-Null
Set-EnvValue 'CORS_ORIGINS'   'http://localhost:5173'    -OnlyIfEmpty | Out-Null
Set-EnvValue 'VITE_API_BASE_URL' '/api'                  -OnlyIfEmpty | Out-Null

# --------------------------------------------------------- 5. the database
Write-Step 5 'Setting up the database'
if ($DatabaseUrl) {
    Set-EnvValue 'DATABASE_URL' $DatabaseUrl | Out-Null
    Write-Ok 'Using the supplied DATABASE_URL'
} else {
    # Ship PostgreSQL as a pip wheel so no installer, admin rights or Docker are needed.
    if (-not (Get-PgBin)) {
        Write-Skip 'Downloading PostgreSQL binaries (~54 MB)...'
        & $VenvPython -m pip install --quiet postgresql-binaries
        if ($LASTEXITCODE -ne 0) { throw 'Could not install postgresql-binaries. Pass -DatabaseUrl to use your own database.' }

        $archive = Get-ChildItem (Join-Path $ApiDir '.venv\Lib\site-packages\postgresql_binaries') `
                   -Filter '*.tar.gz' | Select-Object -First 1
        New-Item -ItemType Directory -Force -Path $PgRoot | Out-Null
        tar -xzf $archive.FullName -C $PgRoot
        Write-Ok 'PostgreSQL binaries extracted to .postgres'
    } else {
        Write-Skip 'PostgreSQL binaries already extracted'
    }

    $PgBin = Get-PgBin
    if (-not $PgBin) { throw 'PostgreSQL binaries were not found after extraction.' }

    if (-not (Test-Path (Join-Path $PgData 'PG_VERSION'))) {
        & (Join-Path $PgBin 'initdb.exe') -D $PgData -U postgres --auth=trust --encoding=UTF8 | Out-Null
        Write-Ok 'Database cluster initialised'
    } else {
        Write-Skip 'Database cluster already initialised'
    }

    $running = & (Join-Path $PgBin 'pg_isready.exe') -h 127.0.0.1 -p $DbPort 2>&1
    if ($LASTEXITCODE -ne 0) {
        Start-Process -FilePath (Join-Path $PgBin 'pg_ctl.exe') -WindowStyle Hidden -ArgumentList @(
            '-D', "`"$PgData`"", '-l', "`"$(Join-Path $PgRoot 'server.log')`"",
            '-o', "`"-p $DbPort -c listen_addresses=127.0.0.1`"", 'start'
        )
        Start-Sleep -Seconds 3
        Write-Ok "PostgreSQL started on port $DbPort"
    } else {
        Write-Skip "PostgreSQL already running on port $DbPort"
    }

    $databases = & (Join-Path $PgBin 'psql.exe') -h 127.0.0.1 -p $DbPort -U postgres -Atc 'select datname from pg_database;'
    if ($databases -notcontains $DbName) {
        & (Join-Path $PgBin 'createdb.exe') -h 127.0.0.1 -p $DbPort -U postgres $DbName
        Write-Ok "Database '$DbName' created"
    } else {
        Write-Skip "Database '$DbName' already exists"
    }

    Set-EnvValue 'DATABASE_URL' "postgresql://postgres@127.0.0.1:$DbPort/$DbName" | Out-Null
    Write-Ok 'DATABASE_URL written to .env'
}

# ------------------------------------------------------ 6. schema + seed data
if ($SkipSeed) {
    Write-Step 6 'Skipping seed data (-SkipSeed)'
} else {
    Write-Step 6 'Creating the schema and loading seed data'
    $seedArgs = @((Join-Path $ApiDir 'seed.py'))
    if ($ResetSeed) { $seedArgs += '--reset' }
    & $VenvPython @seedArgs
    if ($LASTEXITCODE -ne 0) { throw 'Seeding failed.' }
}

# ------------------------------------------------------------- 7. next steps
Write-Host "`nSetup complete." -ForegroundColor Green
Write-Host @"

Start the app with two terminals:

  1. Backend    cd api; .\.venv\Scripts\python.exe -m uvicorn index:app --reload --port 8000
  2. Frontend   npm run dev

Then open http://localhost:5173

Sign in with:
  admin       admin@local.dev      / Admin@12345
  candidate   sneha@local.dev      / Test@12345

Before running code, set PISTON_ENDPOINTS in .env to a reachable Piston judge,
otherwise submissions return JUDGE_UNAVAILABLE. See SETUP.md.
"@

exit 0

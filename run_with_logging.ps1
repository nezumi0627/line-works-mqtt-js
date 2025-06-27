# ログディレクトリがなければ作成
$logDir = "$PSScriptRoot\logs"
if (!(Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# 現在の日時を基にログファイル名を生成
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$logDir\app_${timestamp}.log"

# コンソール出力をファイルと画面の両方に出力する関数
function Write-Log {
    param (
        [string]$Message
    )
    
    $timestamp = Get-Date -Format "[yyyy-MM-dd HH:mm:ss.fff]"
    $logMessage = "$timestamp $Message"
    
    # ログレベルに応じて色を変更
    if ($Message -match "^\[\w+\] ") {
        $level = $Message -split "\s+"[1]
        switch ($level) {
            "[info]" { $color = "Green" }
            "[warn]" { $color = "Yellow" }
            "[error]" { $color = "Red" }
            "[debug]" { $color = "Cyan" }
            default { $color = "White" }
        }
        Write-Host $logMessage -ForegroundColor $color
    } else {
        Write-Host $logMessage
    }

    # ファイルに出力（色なし）
    Add-Content -Path $logFile -Value $logMessage -Encoding UTF8
}

# ログの開始を記録
Write-Log "=== アプリケーションを開始します ==="

# 標準出力と標準エラー出力をリダイレクト
$processStartInfo = @{
    FileName = "node.exe"
    Arguments = "client.js"
    WorkingDirectory = $PSScriptRoot
    RedirectStandardOutput = $true
    RedirectStandardError = $true
    UseShellExecute = $false
}

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processStartInfo

# 標準出力のリダイレクト
$stdOutJob = Register-ObjectEvent -InputObject $process -EventName OutputDataReceived -Action {
    if (![string]::IsNullOrWhiteSpace($EventArgs.Data)) {
        Write-Log $EventArgs.Data
    }
}

# 標準エラー出力のリダイレクト
$stdErrJob = Register-ObjectEvent -InputObject $process -EventName ErrorDataReceived -Action {
    if (![string]::IsNullOrWhiteSpace($EventArgs.Data)) {
        Write-Log "[ERROR] $($EventArgs.Data)"
    }
}

try {
    # プロセス開始
    [void]$process.Start()
    
    # 非同期で出力を読み取り開始
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()
    
    # プロセス終了を待機
    $process.WaitForExit()
    
    # 終了コードを記録
    Write-Log "=== アプリケーションが終了しました (終了コード: $($process.ExitCode)) ==="
}
catch {
    Write-Log "[ERROR] エラーが発生しました: $_"
}
finally {
    # イベント登録を解除
    Unregister-Event -SourceIdentifier $stdOutJob.Name
    Unregister-Event -SourceIdentifier $stdErrJob.Name
    
    # プロセスを確実に終了
    if (!$process.HasExited) {
        $process.Kill()
    }
    $process.Dispose()
    
    Write-Host "`nログファイルに出力しました: $logFile"
}

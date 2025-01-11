# 定义变量
$ImageName = "react-electron-app"
$ContainerName = "react-electron-container"

# 步骤 1: 清理旧的 Docker 缓存
Write-Host "Cleaning up Docker cache..."
docker builder prune -f

# 检查是否清理成功
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to clean Docker cache. Exiting script."
    exit $LASTEXITCODE
}

# 步骤 2: 构建 Docker 镜像
Write-Host "Building Docker image..."
docker build -t $ImageName .

# 检查镜像构建是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker image build failed. Exiting script."
    exit $LASTEXITCODE
}

# 步骤 3: 运行容器
Write-Host "Running Docker container..."
docker run --name $ContainerName --rm -d $ImageName

# 检查容器是否启动成功
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start Docker container. Exiting script."
    exit $LASTEXITCODE
}

# 等待容器启动
Start-Sleep -Seconds 5

# 步骤 4: 检查 Electron 主进程输出文件
Write-Host "Checking for generated files in 'electron-build' directory..."
docker exec $ContainerName powershell -Command {
    if (Test-Path "/app/electron-build") {
        Get-ChildItem -Path "/app/electron-build"
    } else {
        Write-Error "electron-build directory does not exist."
        exit 1
    }
}

# 检查是否成功找到文件
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to find 'electron-build' directory. Please check your Dockerfile and build process."
} else {
    Write-Host "Electron build files found successfully."
}

# 停止并清理容器
Write-Host "Stopping and cleaning up Docker container..."
docker stop $ContainerName

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to stop the container. Manual cleanup may be required."
    exit $LASTEXITCODE
}

Write-Host "Script completed successfully."

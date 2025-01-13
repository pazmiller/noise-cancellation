pipeline {
    agent { label 'docker-agent' }  // 在带有 Docker 的 Agent 上执行
    
    stages {
        stage('Build & Push App Image') {
            steps {
                sh """
                  cd app
                  docker build -t my-electron-app:latest .
                  docker push my-electron-app:latest
                """
            }
        }
    }
}

pipeline {
    agent any

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

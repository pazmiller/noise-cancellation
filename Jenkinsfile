pipeline {
    agent {
        docker {
            // 使用google官方带Cloud SDK的镜像 (内含gcloud命令)
            image 'google/cloud-sdk:slim'
            args '-u root:root'  // 可选：以root身份执行容器
        }
    }

    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-artifact-key')
        GCP_PROJECT_ID = "jenkins-services"
        GCP_REGION = "asia-southeast1"
        ARTIFACT_REPO = "my-electron-repo"
        IMAGE_NAME = "electron-noise"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Verify GCP Auth') {
            steps {
                sh '''
                  gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
                  gcloud config set project $GCP_PROJECT_ID
                  gcloud artifacts repositories list --location=$GCP_REGION
                '''
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    sh """
                      gcloud auth configure-docker $GCP_REGION-docker.pkg.dev --quiet
                      def fullImageName="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"
                      docker build -t $fullImageName .
                      docker push $fullImageName
                    """
                }
            }
        }
    }
}

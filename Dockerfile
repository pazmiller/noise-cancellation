pipeline {
    agent any
    
    // 可以把要用的变量都集中放在 environment 里
    environment {
        GCP_REGION      = 'asia-southeast1'
        GCP_PROJECT_ID  = 'jenkins-services'
        ARTIFACT_REPO   = 'my-electron-repo'
        IMAGE_NAME      = 'electron-noise'
        IMAGE_TAG       = 'latest'
        // 这里用 file(credentialsId:) 方式读取 Service Account JSON
        // Jenkins 会把它映射为 $GOOGLE_APPLICATION_CREDENTIALS
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-artifact-key')
    }
    
    stages {
        stage('Build & Push Docker Image') {
            steps {
                // 在这里注入 Service Account 文件并进行 gcloud 的认证
                withCredentials([file(credentialsId: 'gcp-artifact-key', variable: 'GCP_KEYFILE')]) {
                    sh """
                      # 1) gcloud 认证
                      gcloud auth activate-service-account --key-file="${GCP_KEYFILE}"
                      gcloud config set project ${GCP_PROJECT_ID}
                      
                      # 2) 配置 Docker 认证，让 Docker CLI 能推镜像到 GCP AR
                      gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet
                      
                      # 3) 构建镜像 (基于你的多阶段 Dockerfile)
                      docker build -t ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG} .
                      
                      # 4) 推送镜像
                      docker push ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
}
